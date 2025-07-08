import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transcribeAudio, generateISBARReport } from "./services/openai";
import { upload } from "./services/audio";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertPatientSchema, insertHandoverSchema } from "@shared/schema";
import { z } from "zod";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { employeeId, password } = req.body;
      
      if (!employeeId || !password) {
        return res.status(400).json({ message: 'Employee ID and password are required' });
      }

      const user = await storage.validateUser(employeeId, password);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, employeeId: user.employeeId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token, 
        user: {
          id: user.id,
          employeeId: user.employeeId,
          name: user.name,
          role: user.role,
          department: user.department,
          shift: user.shift
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmployeeId(userData.employeeId);
      if (existingUser) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign(
        { id: user.id, employeeId: user.employeeId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token, 
        user: {
          id: user.id,
          employeeId: user.employeeId,
          name: user.name,
          role: user.role,
          department: user.department,
          shift: user.shift
        }
      });
    } catch (error) {
      res.status(400).json({ message: 'Registration failed' });
    }
  });

  // User routes
  app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });

  // Patient routes
  app.get('/api/patients/search', authenticateToken, async (req, res) => {
    try {
      const { query, ward, status } = req.query;
      const patients = await storage.searchPatients(
        query as string || '',
        ward as string,
        status as string
      );
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Search failed' });
    }
  });

  app.get('/api/patients/:id', authenticateToken, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch patient' });
    }
  });

  app.post('/api/patients', authenticateToken, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.json(patient);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create patient' });
    }
  });

  // Handover routes
  app.get('/api/handovers/recent', authenticateToken, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const handovers = await storage.getRecentHandovers(limit);
      res.json(handovers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch handovers' });
    }
  });

  app.get('/api/handovers/patient/:patientId', authenticateToken, async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const handovers = await storage.getHandoversByPatient(patientId);
      res.json(handovers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch patient handovers' });
    }
  });

  app.post('/api/handovers', authenticateToken, upload.single('audio'), async (req, res) => {
    try {
      const { patientId } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: 'Audio file is required' });
      }

      // Create initial handover record
      const handover = await storage.createHandover({
        patientId: parseInt(patientId),
        nurserId: req.user.id,
        audioPath: req.file.path,
        status: 'processing'
      });

      // Process audio in background
      processHandoverAudio(handover.id, req.file.path, parseInt(patientId));

      res.json(handover);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create handover' });
    }
  });

  app.get('/api/handovers/:id', authenticateToken, async (req, res) => {
    try {
      const handoverId = parseInt(req.params.id);
      const handover = await storage.getHandover(handoverId);
      if (!handover) {
        return res.status(404).json({ message: 'Handover not found' });
      }
      res.json(handover);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch handover' });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
      const recentHandovers = await storage.getHandoversByNurse(req.user.id);
      const todayHandovers = recentHandovers.filter(h => {
        const today = new Date();
        const handoverDate = h.createdAt ? new Date(h.createdAt) : null;
        return handoverDate ? handoverDate.toDateString() === today.toDateString() : false;
      });

      res.json({
        todayHandovers: todayHandovers.length,
        totalHandovers: recentHandovers.length
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Background processing function
async function processHandoverAudio(handoverId: number, audioPath: string, patientId: number) {
  try {
    // Transcribe audio
    const transcription = await transcribeAudio(audioPath);
    
    // Update handover with transcription
    await storage.updateHandover(handoverId, {
      transcription: transcription.text,
      status: 'transcribed'
    });

    // Get patient info for ISBAR generation
    const patient = await storage.getPatient(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Generate ISBAR report
    const isbarReport = await generateISBARReport(transcription.text, patient);
    
    // Update handover with ISBAR report
    await storage.updateHandover(handoverId, {
      isbarReport: isbarReport,
      status: 'complete'
    });

  } catch (error) {
    console.error('Error processing handover:', error);
    await storage.updateHandover(handoverId, {
      status: 'error'
    });
  }
}
