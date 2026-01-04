// Format wallet address
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return "";
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format token amount
export const formatTokenAmount = (
  amount,
  decimals = 18,
  displayDecimals = 4
) => {
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toFixed(displayDecimals);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

// Format timestamp
export const formatTimestamp = (timestamp) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

// Format large numbers (1000 -> 1K)
export const formatLargeNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
