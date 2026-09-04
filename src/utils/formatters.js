/**
 * Formatting utilities for Indian currency, areas, and cadastral numbers
 */

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatArea = (area, unit = 'Hectare') => {
  if (area === undefined || area === null) return '';
  return `${area} ${unit}`;
};

export const formatULPIN = (ulpin) => {
  if (!ulpin) return '';
  return ulpin.toUpperCase();
};

export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return '';
  return aadhaar.replace(/^(\d{4})-(\d{4})/, 'XXXX-XXXX');
};

export default {
  formatCurrency,
  formatArea,
  formatULPIN,
  maskAadhaar,
};
