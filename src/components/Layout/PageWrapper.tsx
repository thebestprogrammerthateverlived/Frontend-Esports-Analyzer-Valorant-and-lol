// ============================================================================
// PAGE WRAPPER - Consistent layout container

import React from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-zinc-400 text-sm">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.main>
  );
};