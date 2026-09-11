/**
 * Validation helpers for Indian Land records, mobile numbers, and PAN/Aadhaar
 */

export const isValidULPIN = (ulpin) => {
  if (!ulpin) return false;
  // Format: ULPIN-STATE-DIST-000000 or 14-digit alphanumeric Bhu-Aadhaar
  return /^ULPIN-[A-Z]{2}-[A-Z]{3}-\d{6}$/i.test(ulpin) || /^[A-Z0-9]{14}$/i.test(ulpin);
};

export const isValidMobile = (mobile) => {
  if (!mobile) return false;
  const cleaned = mobile.replace(/[^0-9]/g, '');
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};

export const isValidPAN = (pan) => {
  if (!pan) return false;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan.trim());
};

export default {
  isValidULPIN,
  isValidMobile,
  isValidPAN,
};
