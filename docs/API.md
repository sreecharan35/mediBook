# MediBook REST API Reference

Base URL: `http://localhost:5000/api`

---

## Authentication

### POST `/auth/register`
Register a new user account.

**Body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123", "role": "patient" }
```
**Response:** `201` `{ token, user }`

---

### POST `/auth/login`
Authenticate and receive a JWT token.

**Body:** `{ email, password }`  
**Response:** `200` `{ token, user }`

---

### GET `/auth/me`
Get the currently authenticated user. Requires `Authorization: Bearer <token>`.

---

## Doctors

### GET `/doctors`
List all doctors with optional filters.

| Query Param | Type | Example |
|---|---|---|
| `specialty` | string | `Cardiologist` |
| `minRating` | number | `4.5` |
| `maxFee` | number | `120` |
| `search` | string | `Sarah` |

**Response:** `{ count, doctors[] }`

---

### GET `/doctors/:id`
Get a single doctor by ID.

---

### GET `/doctors/:id/slots`
Get available time slots for a doctor.

| Query Param | Type | Example |
|---|---|---|
| `date` | string | `2025-01-20` |

**Response:** `{ date, slots: [{ time, available }] }`

---

## Appointments

### POST `/appointments`
Book a new appointment (public — no auth required).

**Body:**
```json
{
  "doctorId": 1,
  "doctorName": "Dr. Sarah Mitchell",
  "specialty": "Cardiologist",
  "date": "2025-01-20",
  "time": "10:00",
  "type": "in-person",
  "patientName": "John Doe",
  "patientEmail": "john@example.com",
  "patientPhone": "+1234567890",
  "reason": "Annual checkup"
}
```
**Response:** `201` `{ success, appointment }`

---

### GET `/appointments`
List appointments. Auth required.

### GET `/appointments/:id`
Get appointment by ID. Auth required.

### PATCH `/appointments/:id/cancel`
Cancel an appointment. Auth required.

### PATCH `/appointments/:id/reschedule`
Reschedule. Body: `{ date, time }`. Auth required.

---

## Notifications

### POST `/notifications/contact`
Submit a contact form message.

**Body:** `{ name, email, subject, message }`

### POST `/notifications/subscribe`
Subscribe to newsletter. Body: `{ email }`
