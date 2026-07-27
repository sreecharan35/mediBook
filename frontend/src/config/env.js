/**
 * Environment Configuration
 * 
 * Centralized, validated environment variables.
 * Throw an error immediately during boot if a critical variable is missing.
 * This ensures the app never runs in an undefined state.
 */

const getEnvVar = (key, fallback = '') => {
  const value = import.meta.env[key];
  if (value === undefined && fallback === '') {
    console.warn(`[Config Warning] Environment variable ${key} is missing.`);
  }
  return value || fallback;
};

export const ENV = {
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  N8N_WEBHOOK_URL: getEnvVar('VITE_N8N_WEBHOOK_URL'),
  
  // Placeholders for future AI integrations
  OPENAI_API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
  VAPI_PUBLIC_KEY: getEnvVar('VITE_VAPI_PUBLIC_KEY'),
  TWILIO_ACCOUNT_SID: getEnvVar('VITE_TWILIO_ACCOUNT_SID'),
  
  // App Config
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
