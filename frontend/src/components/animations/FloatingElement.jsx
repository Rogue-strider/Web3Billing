import React from 'react';
import { motion } from 'framer-motion';

export const FloatingElement = ({ 
  children, 
  duration = 3,
  yOffset = 20,
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.7,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ children, direction = 'left', delay = 0 }) => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: 100 },
    down: { y: -100 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;