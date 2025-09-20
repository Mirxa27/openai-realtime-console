import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const GlassCard = forwardRef(({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  ...props 
}, ref) => {
  const baseClasses = `
    bg-white/10 backdrop-blur-md border border-white/20 
    rounded-2xl shadow-lg shadow-black/10
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      className={baseClasses}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </Component>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;