import { z } from "zod";

// Define the Zod schema for registration
export const registerSchema = z.object({
  email: z.string().email("invalid format").min(1, "is required"),
  password: z
    .string()
    .min(6, "must be at least 6 characters long")
    .regex(/[A-Z]/, "must contain at least one uppercase letter")
    .regex(/[\W_]/, "must contain at least one special character"),
});

// Define the Zod schema for login
export const loginSchema = z.object({
  email: z.string().email("invalid format").min(1, "is required"),
  password: z.string().min(6, "is required"),
});
export const todoSchema = z.object({
  title: z.string().min(3, "is required"),
  description: z.string().min(6, "is required"),
});

// Extract the TypeScript types from the Zod schemas
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type TodoSchema = z.infer<typeof todoSchema>;
