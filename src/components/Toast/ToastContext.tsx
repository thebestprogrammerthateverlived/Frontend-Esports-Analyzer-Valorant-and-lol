// ============================================================================
// TOAST CONTEXT - Global notification system
// ============================================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    showToast: (
        type: ToastType,
        title: string,
        message?: string,
        duration?: number
    ) => void;
    hideToast: (id: string) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// ============================================================================
// TOAST COMPONENT
// ============================================================================

const ToastIcon = ({ type }: { type: ToastType }) => {
    const iconProps = { size: 20, strokeWidth: 2.5 };

    switch (type) {
        case 'success':
            return <CheckCircle {...iconProps} className="text-emerald-400" />;
        case 'error':
            return <AlertCircle {...iconProps} className="text-red-400" />;
        case 'warning':
            return <AlertTriangle {...iconProps} className="text-amber-400" />;
        case 'info':
            return <Info {...iconProps} className="text-blue-400" />;
    }
};

const ToastItem = ({
    toast,
    onClose,
}: {
    toast: Toast;
    onClose: () => void;
}) => {
    const bgColors: Record<ToastType, string> = {
        success: 'bg-emerald-950/90 border-emerald-800/50',
        error: 'bg-red-950/90 border-red-800/50',
        warning: 'bg-amber-950/90 border-amber-800/50',
        info: 'bg-blue-950/90 border-blue-800/50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`
        ${bgColors[toast.type]}
        border backdrop-blur-xl
        rounded-lg p-4 pr-10
        shadow-2xl shadow-black/50
        min-w-[320px] max-w-100
        relative
      `}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                    <ToastIcon type={toast.type} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs text-zinc-300 leading-relaxed">
                            {toast.message}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// PROVIDER
// ============================================================================

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (
            type: ToastType,
            title: string,
            message?: string,
            duration: number = 5000
        ) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newToast: Toast = { id, type, title, message, duration };

            setToasts((prev) => [...prev, newToast]);

            // Auto-dismiss
            if (duration > 0) {
                setTimeout(() => {
                    hideToast(id);
                }, duration);
            }
        },
        []
    );

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-0 right-0 z-9999 p-6 pointer-events-none">
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <AnimatePresence mode="popLayout">
                        {toasts.map((toast) => (
                            <ToastItem
                                key={toast.id}
                                toast={toast}
                                onClose={() => hideToast(toast.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </ToastContext.Provider>
    );
};