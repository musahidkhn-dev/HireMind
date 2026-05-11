import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = '', delay = 0, hover = true, ...props }) => {
  return (
    <div
      className={`card ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
