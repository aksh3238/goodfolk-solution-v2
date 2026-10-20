import express from 'express';
import path from 'path';
import fs from 'fs';
import { db, hashPassword, verifyPassword } from './src/server/db';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS for GitHub Pages frontend and local development.
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
