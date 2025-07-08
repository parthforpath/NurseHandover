import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("nurse"),
  department: text("department").notNull(),
  licenseNumber: text("license_number"),
  shift: text("shift"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  room: text("room"),
  admissionDate: timestamp("admission_date"),
  attendingPhysician: text("attending_physician"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const handovers = pgTable("handovers", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  nurserId: integer("nurse_id").notNull(),
  audioPath: text("audio_path"),
  transcription: text("transcription"),
  isbarReport: jsonb("isbar_report"),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userRelations = relations(users, ({ many }) => ({
  handovers: many(handovers)
}));

export const patientRelations = relations(patients, ({ many }) => ({
  handovers: many(handovers)
}));

export const handoverRelations = relations(handovers, ({ one }) => ({
  patient: one(patients, {
    fields: [handovers.patientId],
    references: [patients.id]
  }),
  nurse: one(users, {
    fields: [handovers.nurserId],
    references: [users.id]
  })
}));

export const insertUserSchema = createInsertSchema(users).pick({
  employeeId: true,
  name: true,
  password: true,
  role: true,
  department: true,
  licenseNumber: true,
  shift: true
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  patientId: true,
  name: true,
  age: true,
  gender: true,
  room: true,
  admissionDate: true,
  attendingPhysician: true,
  status: true
});

export const insertHandoverSchema = createInsertSchema(handovers).pick({
  patientId: true,
  nurserId: true,
  audioPath: true,
  transcription: true,
  isbarReport: true,
  status: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertHandover = z.infer<typeof insertHandoverSchema>;
export type Handover = typeof handovers.$inferSelect;
