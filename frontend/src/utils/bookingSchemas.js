import { z } from 'zod';

// ─── Step 1: Patient Information ───────────────────────────────
export const patientSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s\-().]{7,15}$/, 'Please enter a valid phone number'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine(v => {
      const n = parseInt(v);
      return !isNaN(n) && n >= 1 && n <= 120;
    }, 'Age must be between 1 and 120'),
  address: z
    .string()
    .min(10, 'Please enter a complete address (at least 10 characters)')
    .max(200, 'Address is too long'),
});

// ─── Step 2: Doctor Selection ─────────────────────────────────
export const doctorSchema = z.object({
  doctorId: z
    .string({ required_error: 'Please select a doctor' })
    .min(1, 'Please select a doctor'),
  doctorName: z.string().min(1),
  doctorSpecialty: z.string().min(1),
  doctorFee: z.string().min(1),
});

// ─── Step 3: Appointment ─────────────────────────────────────
export const appointmentSchema = z.object({
  date: z.string().min(1, 'Please select an appointment date'),
  time: z.string().min(1, 'Please select a time slot'),
  type: z.enum(['in-person', 'video', 'phone']).default('in-person'),
});

// ─── Full Combined Schema ─────────────────────────────────────
export const bookingSchema = patientSchema
  .merge(doctorSchema)
  .merge(appointmentSchema);

// Field lists per step (used to trigger validation per-step)
export const stepFields = {
  0: ['name', 'email', 'phone', 'gender', 'age', 'address'],
  1: ['doctorId', 'doctorName', 'doctorSpecialty', 'doctorFee'],
  2: ['date', 'time', 'type'],
};
