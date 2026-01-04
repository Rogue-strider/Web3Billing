import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-9xl mb-8"
        >
          404
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold shadow-xl"
          >
            <Home size={20} />
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;