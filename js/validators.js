// Small reusable validation helpers for this vanilla JavaScript project.
export function isRequired(value) {
  return String(value ?? "").trim().length > 0;
}

export function isValidEmail(value) {
  const email = String(value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidMobile(value) {
  // Accept 10-digit Indian mobile numbers, optionally prefixed with +91 or 91.
  const normalized = String(value ?? "").replace(/[\s()-]/g, "");
  return /^(?:(?:\+?91))?[6-9]\d{9}$/.test(normalized);
}

export function isValidPassword(value) {
  // Demo-only validation. Never store passwords in localStorage.
  return typeof value === "string" && value.length >= 8;
}

export function getFieldError(value, rule, label = "This field") {
  if (rule === "required" && !isRequired(value)) return `${label} is required.`;
  if (rule === "email" && !isValidEmail(value)) return "Enter a valid email address.";
  if (rule === "mobile" && !isValidMobile(value)) return "Enter a valid 10-digit Indian mobile number.";
  if (rule === "password" && !isValidPassword(value)) return "Password must be at least 8 characters long.";
  return "";
}