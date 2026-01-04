// src/components/wallet/WalletButton.jsx
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { WalletContext } from '../../contexts/WalletContext';
import toast from 'react-hot-toast';

const WalletButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  const {
    account,
    isConnecting,
    blockchain,
    disconnect,
    isConnected,
  } = useContext(WalletContext);

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    toast.success('Address copied!');
  };

  const openExplorer = () => {
    const explorerUrl = blockchain === 'ethereum' 
      ? `https://etherscan.io/address/${account}`
      : `https://solscan.io/account/${account}`;
    window.open(explorerUrl, '_blank');
  };

  if (!isConnected) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
          className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            <Wallet size={20} />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </motion.button>

        {/* Wallet Selection Modal */}
        <AnimatePresence>
          {showWalletModal && (
            <WalletModal onClose={() => setShowWalletModal(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
      >
        <div className={`w-2 h-2 rounded-full ${
          blockchain === 'ethereum' ? 'bg-purple-400' : 'bg-green-400'
        } animate-pulse`} />
        <span className="font-mono text-sm">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-gray-900 bg-opacity-95 backdrop-blur-xl rounded-xl border border-white border-opacity-20 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white border-opacity-10">
              <div className="text-xs text-gray-400 mb-1">Connected with</div>
              <div className="flex items-center gap-2 font-semibold">
                {blockchain === 'ethereum' ? (
                  <span className="text-2xl">⟠</span>
                ) : (
                  <span className="text-2xl">◎</span>
                )}
                <span>{blockchain === 'ethereum' ? 'MetaMask' : 'Phantom'}</span>
              </div>
              <div className="text-xs text-gray-400 mt-2 font-mono break-all">
                {account}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all text-left"
              >
                <Copy size={18} className="text-gray-400" />
                <span>Copy Address</span>
              </button>
              <button
                onClick={openExplorer}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all text-left"
              >
                <ExternalLink size={18} className="text-gray-400" />
                <span>View on Explorer</span>
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all text-left text-red-400"
              >
                <LogOut size={18} />
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wallet Selection Modal
const WalletModal = ({ onClose }) => {
  const { connectEthereumWallet, connectSolanaWallet } = useContext(WalletContext);

  const wallets = [
    {
      name: 'MetaMask',
      icon: '⟠',
      description: 'Connect to Ethereum & Polygon',
      color: 'from-purple-600 to-blue-600',
      onClick: () => {
        connectEthereumWallet();
        onClose();
      }
    },
    {
      name: 'Phantom',
      icon: '◎',
      description: 'Connect to Solana',
      color: 'from-green-600 to-teal-600',
      onClick: () => {
        connectSolanaWallet();
        onClose();
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-2xl border border-white border-opacity-20 w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-white border-opacity-10">
          <h2 className="text-2xl font-bold">Connect Wallet</h2>
          <p className="text-gray-400 mt-1">Choose your preferred wallet</p>
        </div>

        <div className="p-4 space-y-3">
          {wallets.map((wallet, idx) => (
            <motion.button
              key={wallet.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={wallet.onClick}
              className={`w-full p-4 bg-gradient-to-r ${wallet.color} bg-opacity-10 hover:bg-opacity-20 rounded-xl border border-white border-opacity-10 transition-all flex items-center gap-4`}
            >
              <div className="text-4xl">{wallet.icon}</div>
              <div className="text-left">
                <div className="font-semibold text-lg">{wallet.name}</div>
                <div className="text-sm text-gray-400">{wallet.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-white border-opacity-10">
          <p className="text-xs text-gray-400 text-center">
            By connecting a wallet, you agree to our Terms of Service
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletButton;