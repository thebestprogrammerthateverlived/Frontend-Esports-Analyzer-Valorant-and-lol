// PAGE WRAPPER — Padded content area (title now lives in TopBar)

import React from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
    children: React.ReactNode;
    /** Optionally show a sub-description below the top bar (inlined at page top) */
    description?: string;
    maxWidth?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    description,
    maxWidth = '1100px',
}) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth, margin: '0 auto', padding: '36px 36px 60px' }}
    >
        {description && (
            <p
                style={{
                    fontSize: '17px',
                    color: 'var(--text-muted)',
                    marginBottom: '24px',
                    fontFamily: 'Outfit, sans-serif',
                }}
            >
                {description}
            </p>
        )}
        {children}
    </motion.div>
);