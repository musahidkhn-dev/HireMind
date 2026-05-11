import React from 'react';
import { motion } from 'framer-motion';

const FloatingPanel = ({ children, className = '', delay = 0 }) => {
  return (
    <div className={`glass-panel rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default FloatingPanel;
