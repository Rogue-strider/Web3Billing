// Validate Ethereum address
export const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validate Solana address
export const isValidSolanaAddress = (address) => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate positive number
export const isPositiveNumber = (value) => {
  return !isNaN(value) && Number(value) > 0;
};

// Validate plan duration (in seconds)
export const isValidDuration = (duration) => {
  return isPositiveNumber(duration) && duration >= 86400; // At least 1 day
};
