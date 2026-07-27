const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

/**
 * Helper to pause execution for a given number of milliseconds
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends a payload to the n8n webhook with exponential backoff retry logic.
 *
 * @param {Object} payload The data to send.
 * @param {number} maxRetries Maximum number of retries (default 3).
 * @param {number} baseDelay Base delay in ms before first retry (default 1000).
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
const sendWithRetry = async (payload, maxRetries = 3, baseDelay = 1000) => {
  if (!N8N_WEBHOOK_URL) {
    console.warn('n8n Webhook URL is not defined in environment variables. Skipping webhook dispatch.');
    return false;
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Webhook successfully delivered to n8n (Attempt ${attempt + 1})`);
        return true;
      } else {
        console.warn(`Webhook failed with status ${response.status} on attempt ${attempt + 1}`);
      }
    } catch (error) {
      console.error(`Webhook network error on attempt ${attempt + 1}:`, error.message);
    }

    if (attempt < maxRetries) {
      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s...
      console.log(`Retrying webhook in ${delay}ms...`);
      await sleep(delay);
    }
  }

  console.error('Webhook delivery failed after maximum retries. The data could not be sent to n8n.');
  return false;
};

export const webhookService = {
  /**
   * Triggers the post-booking automation workflow in n8n.
   *
   * @param {Object} data Booking data
   * @param {string} data.patientName
   * @param {string} data.patientPhone
   * @param {string} data.patientEmail
   * @param {string} data.doctorName
   * @param {string} data.doctorDepartment
   * @param {string} data.doctorHospital
   * @param {string} data.date
   * @param {string} data.time
   * @param {string} data.appointmentId
   * @param {string} data.status
   */
  triggerBookingWorkflow: async (data) => {
    const payload = {
      actionType: 'NEW_BOOKING',
      timestamp: new Date().toISOString(),
      data: {
        patient: {
          name: data.patientName,
          phone: data.patientPhone,
          email: data.patientEmail,
        },
        doctor: {
          name: data.doctorName,
          department: data.doctorDepartment,
          hospital: data.doctorHospital || 'Main Hospital', // Fallback if hospital isn't specified
        },
        appointment: {
          id: data.appointmentId,
          date: data.date,
          time: data.time,
          status: data.status || 'Pending',
        }
      }
    };

    // We don't await this directly in the UI layer so we don't block the user experience,
    // but the service itself will handle the retry logic asynchronously in the background.
    return sendWithRetry(payload);
  }
};
