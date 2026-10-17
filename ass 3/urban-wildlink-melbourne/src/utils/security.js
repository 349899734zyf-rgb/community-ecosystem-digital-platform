/**
 * Academic References & Security Acknowledgements:
 * - OWASP XSS Prevention Guidelines (https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
 * - W3C / MDN Web Crypto API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
 * - Vue.js Security Best Practices (https://vuejs.org/guide/best-practices/security.html)
 * - Purpose: Defend against Stored XSS and simulate client-side credential protection (BR C.4)
 */

// 1. HTML Special Characters Entity Mapping Table
const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
}

// 2. Input Sanitization Function: Escape HTML special characters to neutralize XSS payloads
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input
  }
  // Trim whitespace and replace dangerous characters using OWASP regex pattern
  return input
    .trim()
    .replace(/[&<>"'/]/g, match => HTML_ESCAPES[match] || match)
}