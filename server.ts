import express from 'express';
import path from 'path';
import fs from 'fs';
import { db, hashPassword, verifyPassword } from './src/server/db';

const app = express();
const PORT = 3000;

const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Allow larger payloads for base64 image and video uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// In-memory rate limiter for login attempts
const loginAttempts: Record<string, { count: number; lockedUntil: number }> = {};

function rateLimitLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts[ip];

  if (attempt && attempt.lockedUntil > now) {
    const waitSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed login attempts. Please try again in ${waitSeconds} seconds.`
    });
  }

  next();
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 1, lockedUntil: 0 };
  } else {
    loginAttempts[ip].count += 1;
    if (loginAttempts[ip].count >= 5) {
      loginAttempts[ip].lockedUntil = now + 5 * 60 * 1000; // Lock for 5 minutes
      loginAttempts[ip].count = 0;
    }
  }
}

function clearFailedLogin(ip: string) {
  delete loginAttempts[ip];
}

// Authentication Middleware for /api/admin/*
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];
  if (!db.verifySession(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  next();
}

// ----------------------------------------------------
// Public APIs
// ----------------------------------------------------

// 1. Submit Enquiry (Homepage & Contact forms)
app.post('/api/enquiries', (req, res) => {
  try {
    const { name, email, company, phone, service, budget, deadline, details, consent } = req.body;

    if (!name || !email || !phone || !service || !details) {
      return res.status(400).json({
        error: 'Please provide all required fields (Name, Email, Mobile Number, Service Required, and Details).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid business email address.' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please enter a valid mobile number with country code.' });
    }

    const newEnquiry = db.addEnquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: (company || '').trim(),
      phone: phone.trim(),
      service: service.trim(),
      budget: budget ? budget.trim() : undefined,
      deadline: deadline ? deadline.trim() : undefined,
      details: details.trim(),
      consent: Boolean(consent)
    });

    console.log(`[Goodfolk Solution] New enquiry received: ${newEnquiry.id} from ${newEnquiry.name} (${newEnquiry.email})`);

    return res.status(201).json({
      success: true,
      enquiryId: newEnquiry.id,
      message: 'Your enquiry has been received successfully. Our team will review your project and get in touch shortly.'
    });
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    return res.status(500).json({ error: 'Failed to process enquiry. Please try again or reach out to akshay@goodfolksolution.in' });
  }
});

// 2. Client Payment Request Page (Public for that specific token)
app.get('/api/pay/:token', (req, res) => {
  try {
    const { token } = req.params;
    const details = db.getClientPaymentDetails(token);

    if (!details) {
      return res.status(404).json({ error: 'Payment request not found or link has expired.' });
    }

    return res.json({ success: true, ...details });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve payment request' });
  }
});

// 3. Client Payment Submission (Client submits UTR for verification)
app.post('/api/pay/:token/submit', (req, res) => {
  try {
    const { token } = req.params;
    const { amount, utr, notes } = req.body;

    const details = db.getClientPaymentDetails(token);
    if (!details) {
      return res.status(404).json({ error: 'Payment request not found.' });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Please enter a valid payment amount.' });
    }

    if (!utr || utr.trim().length < 6) {
      return res.status(400).json({ error: 'Please enter a valid UTR / UPI Transaction Reference Number.' });
    }

    const result = db.submitPayment({
      projectId: details.project.id,
      clientName: details.project.clientName,
      amount: Number(amount),
      utr: utr.trim(),
      notes: notes ? notes.trim() : undefined
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    console.log(`[Goodfolk Solution] New UPI Payment submitted for verification: UTR ${utr} for ${details.project.clientName}`);

    return res.status(201).json({
      success: true,
      payment: result.payment,
      message: 'Your payment reference has been submitted. Our team will verify the transaction with our bank and issue your official receipt.'
    });
  } catch (err: any) {
    console.error('Error submitting payment:', err);
    return res.status(500).json({ error: 'Failed to submit payment details' });
  }
});

// 4. Public Site Content & Dynamic CMS Data
app.get('/api/site-content', (req, res) => {
  try {
    const siteContent = db.getSiteContent();
    const portfolioProjects = db.getPortfolioProjects(true); // published only
    const trustedBrands = db.getTrustedBrands(true); // active only
    const testimonials = db.getTestimonials(true); // published only
    const serviceConcepts = db.getServiceConcepts(undefined, true); // published only
    const customSections = db.getCustomSections(undefined, undefined, true); // published only
    const mediaLibrary = db.getMediaLibrary();

    return res.json({
      success: true,
      siteContent,
      portfolioProjects,
      trustedBrands,
      testimonials,
      serviceConcepts,
      customSections,
      mediaLibrary
    });
  } catch (err: any) {
    console.error('Failed to fetch site content:', err);
    return res.status(500).json({ error: 'Failed to load site content' });
  }
});

// ----------------------------------------------------
// Admin Authentication APIs
// ----------------------------------------------------

app.post('/api/auth/login', rateLimitLogin, (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const owner = db.getOwner();

    if (email.trim().toLowerCase() !== owner.email.toLowerCase()) {
      recordFailedLogin(ip);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, owner.passwordHash, owner.salt);
    if (!isValid) {
      recordFailedLogin(ip);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    clearFailedLogin(ip);
    const token = db.createSession(owner.id);

    return res.json({
      success: true,
      token,
      user: {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        role: 'owner'
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An unexpected authentication error occurred.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  if (!db.verifySession(token)) {
    return res.status(401).json({ authenticated: false });
  }

  const owner = db.getOwner();
  return res.json({
    authenticated: true,
    user: {
      id: owner.id,
      email: owner.email,
      name: owner.name,
      role: 'owner'
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.deleteSession(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/update-credentials', requireAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword, newEmail, newName } = req.body;
    const owner = db.getOwner();

    if (!verifyPassword(currentPassword, owner.passwordHash, owner.salt)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const updates: Partial<typeof owner> = {};
    if (newEmail) updates.email = newEmail.trim().toLowerCase();
    if (newName) updates.name = newName.trim();
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }
      updates.passwordHash = hashPassword(newPassword, owner.salt);
    }

    db.updateOwner(updates);
    return res.json({ success: true, message: 'Owner credentials updated successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// ----------------------------------------------------
// Admin Protected APIs (Overview, Enquiries, Projects, Payments, Invoices)
// ----------------------------------------------------

app.get('/api/admin/overview', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    return res.json({ success: true, stats });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load dashboard statistics' });
  }
});

app.get('/api/admin/enquiries', requireAdmin, (req, res) => {
  const enquiries = db.getEnquiries();
  return res.json({ success: true, enquiries });
});

app.patch('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const updated = db.updateEnquiry(id, { status, internalNotes });
  if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
  return res.json({ success: true, enquiry: updated });
});

app.post('/api/admin/enquiries/:id/convert', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { agreedAmount, startDate, deadline, projectName, services } = req.body;

    const enquiry = db.getEnquiries().find(e => e.id === id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });

    const newProject = db.createProject({
      clientName: enquiry.company || enquiry.name,
      contactEmail: enquiry.email,
      contactPhone: enquiry.phone,
      projectName: projectName || `${enquiry.service} for ${enquiry.company || enquiry.name}`,
      services: services || [enquiry.service],
      agreedAmount: Number(agreedAmount) || 50000,
      startDate: startDate || new Date().toISOString().split('T')[0],
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'Discovery',
      internalNotes: `Converted from enquiry ${enquiry.id}. Original brief: ${enquiry.details}`,
      enquiryId: enquiry.id
    });

    db.updateEnquiry(id, {
      status: 'Converted',
      convertedProjectId: newProject.id,
      internalNotes: `${enquiry.internalNotes || ''}\nConverted to Project ${newProject.id}`.trim()
    });

    db.createInvoice({
      projectId: newProject.id,
      clientName: newProject.clientName,
      contactEmail: newProject.contactEmail,
      contactPhone: newProject.contactPhone,
      projectName: newProject.projectName,
      amount: newProject.agreedAmount,
      lineItems: [
        { description: `${newProject.projectName} (Full Scope)`, amount: newProject.agreedAmount }
      ],
      issueDate: newProject.startDate,
      dueDate: newProject.deadline,
      status: 'Issued',
      notes: 'Payment via UPI only to 9817961412@ibl. Share UTR on project payment link.',
      upiId: '9817961412@ibl'
    });

    return res.status(201).json({ success: true, project: newProject });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to convert enquiry to project' });
  }
});

app.get('/api/admin/projects', requireAdmin, (req, res) => {
  const projects = db.getProjects();
  return res.json({ success: true, projects });
});

app.post('/api/admin/projects', requireAdmin, (req, res) => {
  try {
    const { clientName, contactEmail, contactPhone, projectName, services, agreedAmount, startDate, deadline, status, internalNotes } = req.body;

    if (!clientName || !projectName || !agreedAmount) {
      return res.status(400).json({ error: 'Client name, project name, and agreed amount are required.' });
    }

    const project = db.createProject({
      clientName: clientName.trim(),
      contactEmail: (contactEmail || '').trim(),
      contactPhone: (contactPhone || '').trim(),
      projectName: projectName.trim(),
      services: Array.isArray(services) ? services : [services],
      agreedAmount: Number(agreedAmount),
      startDate: startDate || new Date().toISOString().split('T')[0],
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: status || 'In Progress',
      internalNotes: internalNotes ? internalNotes.trim() : undefined
    });

    db.createInvoice({
      projectId: project.id,
      clientName: project.clientName,
      contactEmail: project.contactEmail,
      contactPhone: project.contactPhone,
      projectName: project.projectName,
      amount: project.agreedAmount,
      lineItems: [
        { description: `${project.projectName} - Project Deliverables`, amount: project.agreedAmount }
      ],
      issueDate: project.startDate,
      dueDate: project.deadline,
      status: 'Issued',
      notes: 'Direct UPI payment to 9817961412@ibl. Share transaction UTR for verification receipt.',
      upiId: '9817961412@ibl'
    });

    return res.status(201).json({ success: true, project });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

app.patch('/api/admin/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const updated = db.updateProject(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  return res.json({ success: true, project: updated });
});

app.get('/api/admin/payments', requireAdmin, (req, res) => {
  const payments = db.getPayments();
  return res.json({ success: true, payments });
});

app.post('/api/admin/payments/:id/verify', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.verifyPayment(id, 'Akshay');
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true, payment: result.payment, receipt: result.receipt });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});

app.post('/api/admin/payments/:id/reject', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const result = db.rejectPayment(id, reason || 'Transaction not found in bank account.');
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true, payment: result.payment });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reject payment' });
  }
});

app.get('/api/admin/invoices', requireAdmin, (req, res) => {
  const invoices = db.getInvoices();
  return res.json({ success: true, invoices });
});

app.post('/api/admin/invoices', requireAdmin, (req, res) => {
  try {
    const invoice = db.createInvoice(req.body);
    return res.status(201).json({ success: true, invoice });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.get('/api/admin/receipts', requireAdmin, (req, res) => {
  const receipts = db.getReceipts();
  return res.json({ success: true, receipts });
});

// ----------------------------------------------------
// Admin Protected APIs: Content Management System (CMS)
// ----------------------------------------------------

// 1. Get complete CMS data
app.get('/api/admin/content', requireAdmin, (req, res) => {
  try {
    const siteContent = db.getSiteContent();
    const portfolioProjects = db.getPortfolioProjects(false); // all projects
    const trustedBrands = db.getTrustedBrands(false); // all brands
    const testimonials = db.getTestimonials(false); // all testimonials
    const mediaLibrary = db.getMediaLibrary();
    const customSections = db.getCustomSections(undefined, undefined, false);
    const serviceConcepts = db.getServiceConcepts(undefined, false);
    const contentVersions = db.getContentVersions();

    return res.json({
      success: true,
      siteContent,
      portfolioProjects,
      trustedBrands,
      testimonials,
      mediaLibrary,
      customSections,
      serviceConcepts,
      contentVersions
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load CMS content' });
  }
});

// 2. Update Site Content / Headings / Logo / Contact
app.put('/api/admin/content/site', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSiteContent(req.body);
    return res.json({ success: true, siteContent: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update site content' });
  }
});

// 2b. Website Images & Banners Manager APIs
app.get('/api/admin/content/images', requireAdmin, (req, res) => {
  try {
    const images = db.getWebsiteImages();
    return res.json({ success: true, images });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch image slots' });
  }
});

app.put('/api/admin/content/images/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateWebsiteImage(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Image slot not found' });
    return res.json({ success: true, slot: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update image slot' });
  }
});

app.post('/api/admin/content/images/:id/restore', requireAdmin, (req, res) => {
  try {
    const restored = db.restoreWebsiteImage(req.params.id);
    if (!restored) return res.status(400).json({ error: 'No previous image available to restore' });
    return res.json({ success: true, slot: restored });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to restore image slot' });
  }
});

// 2c. Services CMS APIs
app.get('/api/admin/content/services', requireAdmin, (req, res) => {
  try {
    const services = db.getServices();
    return res.json({ success: true, services });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.put('/api/admin/content/services/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    return res.json({ success: true, service: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update service' });
  }
});

// 3. Portfolio CMS
app.post('/api/admin/content/portfolio', requireAdmin, (req, res) => {
  try {
    const { title, category, tagline, image, isConcept, brief, approach, deliverables, specs, tags, published } = req.body;
    if (!title || !category || !image) {
      return res.status(400).json({ error: 'Title, category, and image are required.' });
    }
    const created = db.addPortfolioProject({
      title: title.trim(),
      category: category.trim(),
      tagline: (tagline || '').trim(),
      image: image.trim(),
      isConcept: Boolean(isConcept),
      brief: (brief || '').trim(),
      approach: (approach || '').trim(),
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      specs: specs || { format: 'Vector AI + 3D', timeline: '2-4 Weeks', tools: 'Figma, Illustrator' },
      tags: Array.isArray(tags) ? tags : [],
      gallery: Array.isArray(req.body.gallery) ? req.body.gallery : [],
      videoUrl: req.body.videoUrl || '',
      videoPoster: req.body.videoPoster || '',
      caseStudySections: Array.isArray(req.body.caseStudySections) ? req.body.caseStudySections : [],
      associatedServices: Array.isArray(req.body.associatedServices) ? req.body.associatedServices : [],
      brandStrategy: req.body.brandStrategy || '',
      colorPalette: Array.isArray(req.body.colorPalette) ? req.body.colorPalette : [],
      typographyNotes: req.body.typographyNotes || '',
      clientName: req.body.clientName || '',
      projectYear: req.body.projectYear || '',
      isDraft: Boolean(req.body.isDraft),
      published: published !== undefined ? Boolean(published) : true,
      order: 0
    });
    return res.status(201).json({ success: true, project: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add portfolio project' });
  }
});

app.put('/api/admin/content/portfolio/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updatePortfolioProject(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Portfolio project not found' });
    return res.json({ success: true, project: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update portfolio project' });
  }
});

app.delete('/api/admin/content/portfolio/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deletePortfolioProject(id);
    if (!deleted) return res.status(404).json({ error: 'Portfolio project not found' });
    return res.json({ success: true, message: 'Portfolio project removed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete portfolio project' });
  }
});

app.post('/api/admin/content/portfolio/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
    const reordered = db.reorderPortfolioProjects(orderedIds);
    return res.json({ success: true, projects: reordered });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reorder portfolio projects' });
  }
});

app.post('/api/admin/content/categories', requireAdmin, (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: 'Category name required' });
    const categories = db.addPortfolioCategory(category);
    return res.json({ success: true, categories });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add category' });
  }
});

// 4. Trusted Brands CMS
app.put('/api/admin/content/brands', requireAdmin, (req, res) => {
  try {
    const { brands } = req.body;
    if (!Array.isArray(brands)) return res.status(400).json({ error: 'Brands array required' });
    const updated = db.updateTrustedBrands(brands);
    return res.json({ success: true, brands: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update trusted brands' });
  }
});

app.post('/api/admin/content/brands', requireAdmin, (req, res) => {
  try {
    const { name, logoUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'Brand name required' });
    const brand = db.addTrustedBrand(name, logoUrl);
    return res.status(201).json({ success: true, brand });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add trusted brand' });
  }
});

// 5. Testimonials CMS
app.post('/api/admin/content/testimonials', requireAdmin, (req, res) => {
  try {
    const { clientName, company, designation, photoUrl, rating, text, category, published } = req.body;
    if (!clientName || !text) {
      return res.status(400).json({ error: 'Client name and testimonial text required' });
    }
    const created = db.addTestimonial({
      clientName: clientName.trim(),
      company: (company || '').trim(),
      designation: (designation || '').trim(),
      photoUrl: (photoUrl || '').trim(),
      rating: Number(rating) || 5,
      text: text.trim(),
      category: (category || '').trim(),
      published: published !== undefined ? Boolean(published) : true,
      order: 0,
      isPlaceholder: false
    });
    return res.status(201).json({ success: true, testimonial: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

app.put('/api/admin/content/testimonials/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateTestimonial(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Testimonial not found' });
    return res.json({ success: true, testimonial: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/admin/content/testimonials/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteTestimonial(id);
    if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
    return res.json({ success: true, message: 'Testimonial removed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// 6. Image Upload Handler & Central Media Library Registration
app.post('/api/admin/upload', requireAdmin, (req, res) => {
  try {
    const { dataUrl, filename, altText, focalPoint, fit } = req.body;
    if (!dataUrl || !dataUrl.includes(',')) {
      return res.status(400).json({ error: 'Invalid image data URL' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 payload' });
    }

    const mime = matches[1];
    let ext = 'png';
    if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
    else if (mime.includes('svg')) ext = 'svg';
    else if (mime.includes('webp')) ext = 'webp';
    else if (mime.includes('mp4')) ext = 'mp4';
    else if (mime.includes('webm')) ext = 'webm';
    else if (mime.includes('quicktime') || mime.includes('mov')) ext = 'mov';
    else if (mime.includes('gif')) ext = 'gif';

    const buffer = Buffer.from(matches[2], 'base64');
    const safeBase = (filename || 'creative-asset').replace(/[^a-zA-Z0-9_-]/g, '');
    const safeName = `${Date.now()}-${safeBase}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    // Register automatically in Central Media Library
    const mediaItem = db.addMediaItem({
      name: filename || `Asset ${new Date().toLocaleDateString()}`,
      url: publicUrl,
      size: buffer.length,
      mimeType: mime,
      altText: altText || filename || 'Goodfolk Solution brand asset',
      focalPoint: focalPoint || 'center',
      fit: fit || 'cover'
    });

    return res.json({ success: true, url: publicUrl, media: mediaItem });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Failed to save uploaded image' });
  }
});

// 7. Central Media Library APIs
app.get('/api/admin/media', requireAdmin, (req, res) => {
  try {
    const media = db.getMediaLibrary();
    return res.json({ success: true, media });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch media library' });
  }
});

app.post('/api/admin/media', requireAdmin, (req, res) => {
  try {
    const { name, url, altText, focalPoint, fit, size, mimeType } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: 'Asset name and URL are required' });
    }
    const created = db.addMediaItem({
      name: name.trim(),
      url: url.trim(),
      altText: (altText || '').trim(),
      focalPoint: focalPoint || 'center',
      fit: fit || 'cover',
      size: size || 0,
      mimeType: mimeType || 'image/jpeg'
    });
    return res.status(201).json({ success: true, media: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add media item' });
  }
});

app.put('/api/admin/media/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateMediaItem(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Media asset not found' });
    return res.json({ success: true, media: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update media asset' });
  }
});

app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.deleteMediaItem(id);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true, message: 'Media asset removed from library' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete media asset' });
  }
});

// 8. Custom Sections CMS APIs
app.get('/api/admin/sections', requireAdmin, (req, res) => {
  try {
    const { page, serviceSlug } = req.query;
    const sections = db.getCustomSections(page as string, serviceSlug as string, false);
    return res.json({ success: true, sections });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load sections' });
  }
});

app.post('/api/admin/sections', requireAdmin, (req, res) => {
  try {
    const { page, serviceSlug, title, subtitle, badge, description, layout, cards, bannerImage, ctaText, ctaLink, published } = req.body;
    if (!title || !layout) {
      return res.status(400).json({ error: 'Section title and layout are required' });
    }
    const created = db.addCustomSection({
      page: page || 'home',
      serviceSlug: serviceSlug || undefined,
      title: title.trim(),
      subtitle: (subtitle || '').trim(),
      badge: (badge || '').trim(),
      description: (description || '').trim(),
      layout: layout || 'cards',
      order: 0,
      published: published !== undefined ? Boolean(published) : true,
      cards: Array.isArray(cards) ? cards : [],
      bannerImage: bannerImage || '',
      ctaText: ctaText || '',
      ctaLink: ctaLink || ''
    });
    return res.status(201).json({ success: true, section: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create section' });
  }
});

app.put('/api/admin/sections/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateCustomSection(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Section not found' });
    return res.json({ success: true, section: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update section' });
  }
});

app.post('/api/admin/sections/:id/duplicate', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const duplicated = db.duplicateCustomSection(id);
    if (!duplicated) return res.status(404).json({ error: 'Section not found' });
    return res.status(201).json({ success: true, section: duplicated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to duplicate section' });
  }
});

app.delete('/api/admin/sections/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteCustomSection(id);
    if (!deleted) return res.status(404).json({ error: 'Section not found' });
    return res.json({ success: true, message: 'Section removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete section' });
  }
});

app.post('/api/admin/sections/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds required' });
    const reordered = db.reorderCustomSections(orderedIds);
    return res.json({ success: true, sections: reordered });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reorder sections' });
  }
});

// 9. Service Concepts CMS APIs (Available for EVERY Service)
app.get('/api/admin/concepts', requireAdmin, (req, res) => {
  try {
    const { serviceId } = req.query;
    const concepts = db.getServiceConcepts(serviceId as string, false);
    return res.json({ success: true, concepts });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load concepts' });
  }
});

app.post('/api/admin/concepts', requireAdmin, (req, res) => {
  try {
    const { serviceId, title, category, tagline, description, image, deliverables, clientName, published, featured } = req.body;
    if (!serviceId || !title || !image) {
      return res.status(400).json({ error: 'Service, title, and image are required.' });
    }
    const created = db.addServiceConcept({
      serviceId: serviceId.trim().toLowerCase(),
      title: title.trim(),
      category: category || serviceId,
      tagline: (tagline || '').trim(),
      description: (description || '').trim(),
      image: image.trim(),
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      clientName: (clientName || '').trim(),
      order: 0,
      published: published !== undefined ? Boolean(published) : true,
      featured: Boolean(featured)
    });
    return res.status(201).json({ success: true, concept: created });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create concept' });
  }
});

app.put('/api/admin/concepts/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateServiceConcept(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Concept not found' });
    return res.json({ success: true, concept: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update concept' });
  }
});

app.post('/api/admin/concepts/:id/duplicate', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const duplicated = db.duplicateServiceConcept(id);
    if (!duplicated) return res.status(404).json({ error: 'Concept not found' });
    return res.status(201).json({ success: true, concept: duplicated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to duplicate concept' });
  }
});

app.delete('/api/admin/concepts/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteServiceConcept(id);
    if (!deleted) return res.status(404).json({ error: 'Concept not found' });
    return res.json({ success: true, message: 'Concept removed' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete concept' });
  }
});

app.post('/api/admin/concepts/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds required' });
    const reordered = db.reorderServiceConcepts(orderedIds);
    return res.json({ success: true, concepts: reordered });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reorder concepts' });
  }
});

// 10. Publishing, Drafts & Version History
app.post('/api/admin/content/publish', requireAdmin, (req, res) => {
  try {
    const { content, label } = req.body;
    if (!content) return res.status(400).json({ error: 'Content payload required' });
    const result = db.publishSiteContent(content, label);
    return res.json({
      success: true,
      message: 'Website published live successfully!',
      versionId: result.versionId,
      siteContent: db.getSiteContent()
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to publish content' });
  }
});

app.post('/api/admin/content/draft', requireAdmin, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content payload required' });
    const draft = db.saveDraftContent(content);
    return res.json({
      success: true,
      message: 'Draft saved. Changes will not appear publicly until published.',
      siteContent: draft
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save draft' });
  }
});

app.get('/api/admin/content/versions', requireAdmin, (req, res) => {
  try {
    const versions = db.getContentVersions();
    return res.json({ success: true, versions });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch version history' });
  }
});

app.post('/api/admin/content/versions/:id/restore', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = db.restoreContentVersion(id);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({
      success: true,
      message: 'Version restored and published live successfully!',
      siteContent: result.siteContent
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to restore version' });
  }
});

// ----------------------------------------------------
// Frontend Mounting (Vite in dev, static in prod)
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Goodfolk Solution Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
