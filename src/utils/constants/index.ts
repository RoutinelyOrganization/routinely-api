export const CREDENTIALS_KEY = 'account.credentials';
export const hexadecimalRegex = /^[a-f0-9]+$/;
export const expirationWhenRememberIsOff =
  process.env.NODE_ENV !== 'production' ? 3e5 : 36e5;
export const expirationWhenRememberIsOnn = expirationWhenRememberIsOff * 24 * 7;
