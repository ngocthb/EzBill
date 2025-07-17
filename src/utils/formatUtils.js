/**
 * Utility functions for formatting data
 */

/**
 * Format price with thousand separators using dots
 * @param {string} text - Input text to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (text) => {
  const number = text.replace(/\D/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Format amount to Vietnamese currency format with 'đ' symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (number == null || isNaN(number)) {
    return '0đ';
  }

  const rounded = Math.round(number); // Làm tròn đến số nguyên gần nhất

  return rounded.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format amount to Vietnamese currency format with custom options
 * @param {number} amount - Amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWithOptions = (amount, options = {}) => {
  if (amount == null || isNaN(amount)) {
    return '0đ';
  }

  const defaultOptions = {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  };

  return amount.toLocaleString('vi-VN', defaultOptions);
};

/**
 * Parse formatted price string to number
 * @param {string} formattedPrice - Formatted price string with dots
 * @returns {number} Parsed number
 */
export const parseFormattedPrice = (formattedPrice) => {
  if (!formattedPrice) return 0;
  return parseFloat(formattedPrice.replace(/\D/g, '')) || 0;
};

/**
 * Format date to ISO string format (YYYY-MM-DD)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDateToISO = (date = new Date()) => {
  return date.toISOString().slice(0, 10);
};

/**
 * Format date to Vietnamese locale string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateToVietnamese = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!dateObj || isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */

// lấy tên người dùng 10 kí tự đầu
export const truncateText = (text, maxLength = 10) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 2)}..`;
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatEmail = (email) => {
  if (!email) return '';
  const username = email.split('@')[0];
  return username.replace(/\d+/g, '');
};
