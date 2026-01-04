// Network configurations
export const NETWORKS = {
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
    explorer: "https://etherscan.io",
  },
  POLYGON: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
  },
  MUMBAI: {
    chainId: 80001,
    name: "Mumbai Testnet",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    explorer: "https://mumbai.polygonscan.com",
  },
  SOLANA: {
    name: "Solana",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorer: "https://solscan.io",
  },
  SOLANA_DEVNET: {
    name: "Solana Devnet",
    rpcUrl: "https://api.devnet.solana.com",
    explorer: "https://solscan.io",
  },
};

// Supported tokens
export const TOKENS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    ethereum: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    polygon: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    polygon: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  },
};

// API endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Contract addresses (replace with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  SUBSCRIPTION_MANAGER_ETHEREUM: "0x...",
  SUBSCRIPTION_MANAGER_POLYGON: "0x...",
  SUBSCRIPTION_MANAGER_SOLANA: "...",
};

// App constants
export const APP_NAME = "Web3Billing";
export const PLATFORM_FEE_PERCENTAGE = 2; // 2%
