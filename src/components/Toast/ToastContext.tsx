// TOAST CONTEXT — Ember Console theme

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

// Icon + color per type

const toastConfig: Record<ToastType, { icon: React.ElementType; color: string; cssClass: string }> = {
    success: { icon: CheckCircle, color: '#5E9E7E', cssClass: 'toast-success' },
    error:   { icon: AlertCircle, color: 'var(--accent-rose)', cssClass: 'toast-error' },
    warning: { icon: AlertTriangle, color: 'var(--accent-terra)', cssClass: 'toast-warning' },
    info:    { icon: Info, color: 'var(--info)', cssClass: 'toast-info' },
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const { icon: Icon, color, cssClass } = toastConfig[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 280, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`${cssClass} relative rounded-xl p-4 pr-10 border backdrop-blur-xl`}
            style={{
                minWidth: '300px',
                maxWidth: '380px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            }}
        >
            <button
                onClick={onClose}
                className="absolute top-3 right-3 transition-opacity"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                aria-label="Close"
            >
                <X size={28} />
            </button>

            <div className="flex items-start gap-3">
                <Icon size={28} color={color} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                        color: 'var(--text-primary)',
                        marginBottom: toast.message ? '4px' : 0,
                    }}>
                        {toast.title}
                    </p>
                    {toast.message && (
                        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {toast.message}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((
        type: ToastType,
        title: string,
        message?: string,
        duration = 5000,
    ) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
        if (duration > 0) setTimeout(() => hideToast(id), duration);
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[9999] p-6 pointer-events-none">
                <div className="flex flex-col gap-2.5 pointer-events-auto">
                    <AnimatePresence mode="popLayout">
                        {toasts.map(toast => (
                            <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </ToastContext.Provider>
    );
};