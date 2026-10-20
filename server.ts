import express from 'express';
import path from 'path';
import fs from 'fs';
import { db, hashPassword, verifyPassword } from './src/server/db';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://aksh3238.github.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DATA_FILE = path.join(DATA_DIR, 'data.json');

interface WebsiteData {
  enquiries: any[];
  contacts: any[];
  payments: any[];
  projects: any[];
  testimonials: any[];
  banners: any[];
  categories: any[];
  settings: Record<string, any>;
  users: any[];
}

const defaultData: WebsiteData = {
  enquiries: [],
  contacts: [],
  payments: [],
  projects: [],
  testimonials: [],
  banners: [],
  categories: [],
  settings: {},
  users: []
};

function readData(): WebsiteData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeData(defaultData);
      return defaultData;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);

    return { ...defaultData, ...parsed };
  } catch (error) {
    console.error('Error reading data:', error);
    return defaultData;
  }
}

function writeData(data: WebsiteData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getRequestData(req: express.Request): any {
  return req.body && typeof req.body === 'object' ? req.body : {};
}

function normalizeEmail(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Goodfolk Solution API is running.',
    status: 'ok'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'Goodfolk Solution API',
    endpoints: [
      '/api/health',
      '/api/enquiries',
      '/api/contacts',
      '/api/projects',
      '/api/testimonials',
      '/api/banners',
      '/api/categories',
      '/api/settings',
      '/api/payments'
    ]
  });
});

// Website enquiries: save directly to Google Sheets.
app.post('/api/enquiries', async (req, res) => {
  try {
    const body = getRequestData(req);

    const name = String(body.name || body.fullName || '').trim();
    const email = normalizeEmail(body.email);
    const company = String(
      body.company || body.companyName || body.brand || ''
    ).trim();
    const mobile = String(body.mobile || body.phone || '').trim();
    const service = String(body.service || body.subject || '').trim();
    const budget = String(body.budget || '').trim();
    const deadline = String(body.deadline || '').trim();
    const details = String(
      body.details || body.message || body.description || ''
    ).trim();

    if (!name || !email || !details) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and project details are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error('GOOGLE_SCRIPT_URL environment variable is missing.');

      return res.status(500).json({
        success: false,
        error: 'Enquiry service is not configured. Please try again later.'
      });
    }

    const enquiryId = `GF-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const sheetResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        id: enquiryId,
        createdAt,
        name,
        company,
        email,
        mobile,
        service,
        budget,
        deadline,
        details
      }),
      redirect: 'follow'
    });

    const responseText = await sheetResponse.text();

    let sheetResult: any;

    try {
      sheetResult = JSON.parse(responseText);
    } catch {
      console.error(
        'Google Apps Script returned a non-JSON response:',
        responseText.slice(0, 500)
      );

      return res.status(502).json({
        success: false,
        error: 'Google Sheets did not return a valid response. Check Apps Script deployment access.'
      });
    }

    if (!sheetResponse.ok || sheetResult.success !== true) {
      console.error(
        'Google Sheets save failed:',
        sheetResult.error || sheetResponse.statusText
      );

      return res.status(502).json({
        success: false,
        error: 'Could not save the enquiry to Google Sheets. Please try again.'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully.',
      enquiryId,
      enquiry: {
        id: enquiryId,
        status: 'new'
      }
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to submit your enquiry right now.'
    });
  }
});

app.get('/api/enquiries', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    enquiries: data.enquiries
  });
});

app.patch('/api/enquiries/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.enquiries.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    data.enquiries[index] = {
      ...data.enquiries[index],
      ...getRequestData(req),
      id: data.enquiries[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      enquiry: data.enquiries[index]
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update enquiry.'
    });
  }
});

app.delete('/api/enquiries/:id', (req, res) => {
  try {
    const data = readData();
    const originalLength = data.enquiries.length;

    data.enquiries = data.enquiries.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.enquiries.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Enquiry deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete enquiry.'
    });
  }
});

// General contact form
app.post('/api/contacts', (req, res) => {
  try {
    const body = getRequestData(req);
    const name = String(body.name || body.fullName || '').trim();
    const email = normalizeEmail(body.email);
    const phone = String(body.phone || body.mobile || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const data = readData();

    const contact = {
      id: generateId(),
      name,
      email,
      phone,
      subject,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    data.contacts.unshift(contact);
    writeData(data);

    return res.status(201).json({
      success: true,
      message: 'Your message has been received.'
    });
  } catch (error) {
    console.error('Contact submission error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to submit your message.'
    });
  }
});

app.get('/api/contacts', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    contacts: data.contacts
  });
});

app.patch('/api/contacts/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.contacts.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }

    data.contacts[index] = {
      ...data.contacts[index],
      ...getRequestData(req),
      id: data.contacts[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      contact: data.contacts[index]
    });
  } catch (error) {
    console.error('Error updating contact:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update contact.'
    });
  }
});

app.delete('/api/contacts/:id', (req, res) => {
  try {
    const data = readData();
    const length = data.contacts.length;

    data.contacts = data.contacts.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.contacts.length === length) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Contact message deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete contact.'
    });
  }
});

// Projects
app.get('/api/projects', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    projects: data.projects
  });
});

app.post('/api/projects', (req, res) => {
  try {
    const body = getRequestData(req);

    if (!body.title) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required.'
      });
    }

    const data = readData();

    const project = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    data.projects.unshift(project);
    writeData(data);

    return res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create project.'
    });
  }
});

app.patch('/api/projects/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.projects.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    data.projects[index] = {
      ...data.projects[index],
      ...getRequestData(req),
      id: data.projects[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      project: data.projects[index]
    });
  } catch (error) {
    console.error('Error updating project:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update project.'
    });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const data = readData();
    const length = data.projects.length;

    data.projects = data.projects.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.projects.length === length) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting project:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete project.'
    });
  }
});

// Testimonials
app.get('/api/testimonials', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    testimonials: data.testimonials
  });
});

app.post('/api/testimonials', (req, res) => {
  try {
    const body = getRequestData(req);

    if (!body.name || !body.content) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial content are required.'
      });
    }

    const data = readData();

    const testimonial = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    data.testimonials.unshift(testimonial);
    writeData(data);

    return res.status(201).json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create testimonial.'
    });
  }
});

app.patch('/api/testimonials/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.testimonials.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.'
      });
    }

    data.testimonials[index] = {
      ...data.testimonials[index],
      ...getRequestData(req),
      id: data.testimonials[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      testimonial: data.testimonials[index]
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update testimonial.'
    });
  }
});

app.delete('/api/testimonials/:id', (req, res) => {
  try {
    const data = readData();
    const length = data.testimonials.length;

    data.testimonials = data.testimonials.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.testimonials.length === length) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Testimonial deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete testimonial.'
    });
  }
});

// Banners
app.get('/api/banners', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    banners: data.banners
  });
});

app.post('/api/banners', (req, res) => {
  try {
    const body = getRequestData(req);

    if (!body.title) {
      return res.status(400).json({
        success: false,
        message: 'Banner title is required.'
      });
    }

    const data = readData();

    const banner = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    data.banners.unshift(banner);
    writeData(data);

    return res.status(201).json({
      success: true,
      banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create banner.'
    });
  }
});

app.patch('/api/banners/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.banners.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.'
      });
    }

    data.banners[index] = {
      ...data.banners[index],
      ...getRequestData(req),
      id: data.banners[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      banner: data.banners[index]
    });
  } catch (error) {
    console.error('Error updating banner:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update banner.'
    });
  }
});

app.delete('/api/banners/:id', (req, res) => {
  try {
    const data = readData();
    const length = data.banners.length;

    data.banners = data.banners.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.banners.length === length) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Banner deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete banner.'
    });
  }
});

// Portfolio categories
app.get('/api/categories', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    categories: data.categories
  });
});

app.post('/api/categories', (req, res) => {
  try {
    const body = getRequestData(req);

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.'
      });
    }

    const data = readData();

    const category = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    data.categories.push(category);
    writeData(data);

    return res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create category.'
    });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.categories.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    data.categories[index] = {
      ...data.categories[index],
      ...getRequestData(req),
      id: data.categories[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      category: data.categories[index]
    });
  } catch (error) {
    console.error('Error updating category:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update category.'
    });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const data = readData();
    const length = data.categories.length;

    data.categories = data.categories.filter(
      (item: any) => String(item.id) !== req.params.id
    );

    if (data.categories.length === length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    writeData(data);

    return res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting category:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete category.'
    });
  }
});

// Website settings
app.get('/api/settings', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    settings: data.settings
  });
});

app.put('/api/settings', (req, res) => {
  try {
    const data = readData();

    data.settings = {
      ...data.settings,
      ...getRequestData(req),
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      settings: data.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update settings.'
    });
  }
});

// Payment records
app.get('/api/payments', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    payments: data.payments
  });
});

app.post('/api/payments', (req, res) => {
  try {
    const body = getRequestData(req);

    const payment = {
      ...body,
      id: generateId(),
      status: body.status || 'pending',
      createdAt: new Date().toISOString()
    };

    const data = readData();
    data.payments.unshift(payment);
    writeData(data);

    return res.status(201).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error creating payment record:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create payment record.'
    });
  }
});

app.patch('/api/payments/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.payments.findIndex(
      (item: any) => String(item.id) === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.'
      });
    }

    data.payments[index] = {
      ...data.payments[index],
      ...getRequestData(req),
      id: data.payments[index].id,
      updatedAt: new Date().toISOString()
    };

    writeData(data);

    return res.json({
      success: true,
      payment: data.payments[index]
    });
  } catch (error) {
    console.error('Error updating payment:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update payment.'
    });
  }
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const owner = db.getOwner();

    if (
      email !== normalizeEmail(owner.email) ||
      !verifyPassword(password, owner.passwordHash, owner.salt)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = db.createSession(owner.id);

    return res.json({
      success: true,
      token,
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        role: 'owner'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to log in.'
    });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const body = getRequestData(req);
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const data = readData();

    const existingUser = data.users.find(
      (item: any) => normalizeEmail(item.email) === email
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    data.users.push(user);
    writeData(data);

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to create admin account.'
    });
  }
});

// Generic data endpoint
app.get('/api/data', (_req, res) => {
  const data = readData();

  res.json({
    success: true,
    data
  });
});

// Global error handler
app.use((
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error('Unhandled server error:', err);

  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.'
  });
});

// Unknown endpoint handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.'
  });
});

async function startServer(): Promise<void> {
  try {
    if (db && typeof (db as any).connect === 'function') {
      await (db as any).connect();
    }
  } catch (error) {
    console.error('Database connection warning:', error);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Goodfolk Solution Full-Stack Server running on http://0.0.0.0:${PORT}`
    );
  });
}

startServer();
