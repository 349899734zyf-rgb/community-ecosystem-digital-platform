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

// 3. Native Browser Web Crypto SHA-256 Hash Function (Prevents plaintext password exposure)
export async function hashPassword(password) {
  if (!password) return ''
  try {
    // Encode password string as UTF-8 Uint8Array buffer
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    // Invoke window.crypto.subtle to generate cryptographic digest
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    // Convert array buffer into standard hex string representation
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
  } catch (err) {

    // Fallback if Web Crypto is unsupported
    return btoa(password)
  }
}