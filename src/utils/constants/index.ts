export const CREDENTIALS_KEY = 'account.credentials';
export const hexadecimalRegex = /^[a-f0-9]+$/;
export const expirationWhenRememberIsOff =
  process.env.NODE_ENV === 'production' ? 36e5 : 6e4; // 3e5;
export const expirationWhenRememberIsOnn = expirationWhenRememberIsOff * 24 * 7;
