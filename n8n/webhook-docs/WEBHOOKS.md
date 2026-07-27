# n8n Webhook Documentation

## Overview
MediBook uses n8n to automate post-booking actions. The Express backend fires webhooks to n8n when appointments are created, cancelled, or rescheduled.

---

## Webhook Events

### 1. `appointment-booked`
**Trigger:** Patient books a new appointment  
**n8n Webhook URL:** `http://localhost:5678/webhook/appointment-booked`  
**Payload:**
```json
{
  "event": "appointment-booked",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": {
    "id": 1,
    "confirmationCode": "MB-ABC123",
    "doctorId": 1,
    "doctorName": "Dr. Sarah Mitchell",
    "specialty": "Cardiologist",
    "date": "2025-01-20",
    "time": "10:00",
    "type": "in-person",
    "status": "confirmed",
    "patient": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "reason": "Annual checkup"
  }
}
```

**n8n Workflow Actions:**
- ✅ Send confirmation email to patient (via Gmail node)
- ✅ Send SMS reminder (via Twilio node)
- ✅ Notify doctor (internal notification)
- ✅ Add to Google Calendar (optional)

---

### 2. `appointment-cancelled`
**Trigger:** Patient or doctor cancels an appointment  
**n8n Webhook URL:** `http://localhost:5678/webhook/appointment-cancelled`

**n8n Workflow Actions:**
- ✅ Send cancellation email to patient
- ✅ Free up time slot in doctor's calendar
- ✅ Offer rescheduling link

---

### 3. `appointment-rescheduled`
**Trigger:** Appointment time/date changed  
**n8n Webhook URL:** `http://localhost:5678/webhook/appointment-rescheduled`

**n8n Workflow Actions:**
- ✅ Send new confirmation email with updated details
- ✅ Update calendar entry
- ✅ Send SMS with new slot info

---

## Setting Up n8n

1. Install n8n: `npm install -g n8n`
2. Start: `n8n start`
3. Open: `http://localhost:5678`
4. Import workflows from `n8n/workflows/*.json`
5. Configure credentials (Gmail, Twilio, etc.)
6. Set `N8N_WEBHOOK_URL=http://localhost:5678/webhook` in backend `.env`
