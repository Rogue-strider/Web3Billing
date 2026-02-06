// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import WalletButton from "../wallet/WalletButton";
import { WalletContext } from "../../contexts/WalletContext";


const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wallet = useContext(WalletContext);
  // const account = wallet?.account;
  const { account, isMerchant } = useContext(WalletContext);

  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pricing", path: "/pricing" },
    { name: "Docs", path: "/docs" },
  ];

  if (account) {
    navLinks.push(
      { name: "Merchant", path: "/merchant/dashboard" },
      { name: "Plans", path: "/merchant/plans" },
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 bg-opacity-80 backdrop-blur-xl border-b border-white border-opacity-10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 ">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative w-10 h-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
              Web3Billing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <Link key={link.path} to={link.path} className="relative group">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`transition-colors ${
                    isActive(link.path)
                      ? "text-purple-400 font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </motion.span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <WalletButton />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg transition-all ${
                        isActive(link.path)
                          ? "bg-purple-600 bg-opacity-20 text-purple-400 font-semibold"
                          : "text-gray-300 hover:bg-white hover:bg-opacity-10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
