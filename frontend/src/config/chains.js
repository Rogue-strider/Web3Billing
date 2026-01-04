export const supportedChains = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "⟠",
    color: "from-purple-600 to-blue-600",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
    explorer: "https://etherscan.io",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "⬡",
    color: "from-purple-600 to-violet-600",
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
  },
  {
    id: "solana",
    name: "Solana",
    icon: "◎",
    color: "from-green-600 to-teal-600",
    rpcUrl: "https://api.mainnet-beta.solana.com",
    explorer: "https://solscan.io",
  },
];

export const getChainById = (id) => {
  return supportedChains.find((chain) => chain.id === id);
};
