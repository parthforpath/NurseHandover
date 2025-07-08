import { users, patients, handovers, type User, type InsertUser, type Patient, type InsertPatient, type Handover, type InsertHandover } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmployeeId(employeeId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(employeeId: string, password: string): Promise<User | null>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  searchPatients(query: string, ward?: string, status?: string): Promise<Patient[]>;
  
  // Handover methods
  getHandover(id: number): Promise<Handover | undefined>;
  getHandoversByPatient(patientId: number): Promise<Handover[]>;
  getHandoversByNurse(nurserId: number): Promise<Handover[]>;
  getRecentHandovers(limit: number): Promise<(Handover & { patient: Patient, nurse: User })[]>;
  createHandover(handover: InsertHandover): Promise<Handover>;
  updateHandover(id: number, updates: Partial<Handover>): Promise<Handover>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmployeeId(employeeId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.employeeId, employeeId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async validateUser(employeeId: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmployeeId(employeeId);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.patientId, patientId));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async searchPatients(query: string, ward?: string, status?: string): Promise<Patient[]> {
    let whereClause = or(
      like(patients.name, `%${query}%`),
      like(patients.patientId, `%${query}%`)
    );

    if (ward) {
      whereClause = and(whereClause, like(patients.room, `%${ward}%`));
    }

    if (status) {
      whereClause = and(whereClause, eq(patients.status, status));
    }

    return await db.select().from(patients).where(whereClause);
  }

  async getHandover(id: number): Promise<Handover | undefined> {
    const [handover] = await db.select().from(handovers).where(eq(handovers.id, id));
    return handover || undefined;
  }

  async getHandoversByPatient(patientId: number): Promise<Handover[]> {
    return await db.select().from(handovers)
      .where(eq(handovers.patientId, patientId))
      .orderBy(desc(handovers.createdAt));
  }

  async getHandoversByNurse(nurserId: number): Promise<Handover[]> {
    return await db.select().from(handovers)
      .where(eq(handovers.nurserId, nurserId))
      .orderBy(desc(handovers.createdAt));
  }

  async getRecentHandovers(limit: number): Promise<(Handover & { patient: Patient, nurse: User })[]> {
    const results = await db.select({
      id: handovers.id,
      patientId: handovers.patientId,
      nurserId: handovers.nurserId,
      audioPath: handovers.audioPath,
      transcription: handovers.transcription,
      isbarReport: handovers.isbarReport,
      status: handovers.status,
      createdAt: handovers.createdAt,
      updatedAt: handovers.updatedAt,
      patient: patients,
      nurse: users
    })
    .from(handovers)
    .leftJoin(patients, eq(handovers.patientId, patients.id))
    .leftJoin(users, eq(handovers.nurserId, users.id))
    .orderBy(desc(handovers.createdAt))
    .limit(limit);

    // Filter out results where patient or nurse is null
    return results.filter(result => result.patient && result.nurse) as (Handover & { patient: Patient, nurse: User })[];
  }

  async createHandover(insertHandover: InsertHandover): Promise<Handover> {
    const [handover] = await db
      .insert(handovers)
      .values(insertHandover)
      .returning();
    return handover;
  }

  async updateHandover(id: number, updates: Partial<Handover>): Promise<Handover> {
    const [handover] = await db
      .update(handovers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(handovers.id, id))
      .returning();
    return handover;
  }
}

export const storage = new DatabaseStorage();
