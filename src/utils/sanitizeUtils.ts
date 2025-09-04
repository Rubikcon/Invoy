/**
 * Utility functions for consistent input sanitization across the application
 */

/**
 * Sanitizes a string input by trimming whitespace
 * @param input String to sanitize
 * @returns Trimmed string
 */
export const sanitizeString = (input: string | null | undefined): string => {
  return (input || '').trim();
};

/**
 * Sanitizes an email address by trimming whitespace and converting to lowercase
 * @param email Email to sanitize
 * @returns Sanitized email
 */
export const sanitizeEmail = (email: string | null | undefined): string => {
  return (email || '').trim().toLowerCase();
};

/**
 * Sanitizes a wallet address by trimming whitespace and converting to lowercase
 * @param address Wallet address to sanitize
 * @returns Sanitized wallet address
 */
export const sanitizeWalletAddress = (address: string | null | undefined): string => {
  return (address || '').trim().toLowerCase();
};

/**
 * Sanitizes a network name by trimming whitespace and converting to lowercase
 * @param network Network name to sanitize
 * @returns Sanitized network name
 */
export const sanitizeNetwork = (network: string | null | undefined): string => {
  return (network || '').trim().toLowerCase();
};

/**
 * Sanitizes a token symbol by trimming whitespace and converting to uppercase
 * @param token Token symbol to sanitize
 * @returns Sanitized token symbol
 */
export const sanitizeToken = (token: string | null | undefined): string => {
  return (token || '').trim().toUpperCase();
};

/**
 * Validates if a string is a valid email
 * @param email Email to validate
 * @returns Boolean indicating if valid
 */
export const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is a valid Ethereum wallet address
 * @param address Address to validate
 * @returns Boolean indicating if valid
 */
export const isValidWalletAddress = (address: string | null | undefined): boolean => {
  if (!address) return false;
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};
