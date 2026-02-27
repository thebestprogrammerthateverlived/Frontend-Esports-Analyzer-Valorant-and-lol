// ERROR DISPLAY — Ember Console theme

import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, AlertCircle, Clock, Database, Wifi, Server, XCircle } from 'lucide-react';

export interface ErrorDisplayProps {
    error: Error | any;
    onRetry?: () => void;
    onReset?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onReset }) => {
    const statusCode = error?.statusCode || error?.status || 500;
    const message    = error?.message || 'An unexpected error occurred';
    const details    = error?.details;
    const retryAfter = error?.retryAfter;

    const getErrorConfig = () => {
        if (statusCode === 429 || message.toLowerCase().includes('rate limit')) {
            return {
                icon: Clock,
                iconColor: 'var(--accent-terra)',
                borderColor: 'rgba(212,149,122,0.3)',
                bgColor: 'var(--accent-terra-dim)',
                title: 'API Rate Limit Exceeded',
                message: 'The Grid.gg API has limited requests per minute.',
                details: retryAfter ? `Please wait ${retryAfter} before trying again.` : 'Please wait a moment and try again.',
                showRetry: true,
            };
        }
        if (statusCode === 404 && (message.includes('insufficient data') || message.includes('no recent matches'))) {
            return {
                icon: Database,
                iconColor: 'var(--info)',
                borderColor: 'rgba(107,140,174,0.3)',
                bgColor: 'rgba(107,140,174,0.08)',
                title: 'No Recent Match Data',
                message,
                details: "This team hasn't played in the last 3 months.",
                showRetry: false,
                showReset: true,
            };
        }
        if (statusCode === 404) {
            return {
                icon: XCircle,
                iconColor: 'var(--text-secondary)',
                borderColor: 'var(--border)',
                bgColor: 'var(--bg-elevated)',
                title: 'Not Found',
                message,
                details: details || 'The requested resource was not found.',
                showRetry: false,
                showReset: true,
            };
        }
        if (statusCode === 0 || message.includes('Network error')) {
            return {
                icon: Wifi,
                iconColor: 'var(--accent-rose)',
                borderColor: 'rgba(201,112,112,0.3)',
                bgColor: 'var(--accent-rose-dim)',
                title: 'Connection Failed',
                message: 'Unable to connect to the API server.',
                details: 'Please check your internet connection or try again later.',
                showRetry: true,
            };
        }
        if (statusCode === 504 || message.includes('timeout')) {
            return {
                icon: Clock,
                iconColor: 'var(--accent-terra)',
                borderColor: 'rgba(212,149,122,0.3)',
                bgColor: 'var(--accent-terra-dim)',
                title: 'Request Timeout',
                message: 'The server is taking too long to respond.',
                details: 'This usually happens during cache misses. Please try again.',
                showRetry: true,
            };
        }
        if (statusCode === 503) {
            return {
                icon: Server,
                iconColor: 'var(--info)',
                borderColor: 'rgba(107,140,174,0.3)',
                bgColor: 'rgba(107,140,174,0.08)',
                title: 'Service Unavailable',
                message: 'The API server is temporarily unavailable.',
                details: 'Please try again in a few moments.',
                showRetry: true,
            };
        }
        return {
            icon: AlertCircle,
            iconColor: 'var(--accent-rose)',
            borderColor: 'rgba(201,112,112,0.3)',
            bgColor: 'var(--accent-rose-dim)',
            title: 'Something Went Wrong',
            message,
            details: details || 'An unexpected error occurred. Please try again.',
            showRetry: true,
        };
    };

    const config = getErrorConfig();
    const Icon = config.icon;

    const btnBase: React.CSSProperties = {
        padding: '10px 24px',
        borderRadius: '8px',
        fontSize: '18px',
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.06em',
        cursor: 'pointer',
        border: 'none',
        transition: 'opacity 0.15s ease',
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-xl"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    border: `1px solid ${config.borderColor}`,
                }}
            >
                <div className="text-center">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{ backgroundColor: config.bgColor, border: `1px solid ${config.borderColor}` }}
                    >
                        <Icon size={40} color={config.iconColor} strokeWidth={1.8} />
                    </div>

                    <h3 style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '26px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                    }}>
                        {config.title}
                    </h3>

                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {config.message}
                    </p>

                    {config.details && (
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                            {config.details}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-3">
                        {config.showRetry && onRetry && (
                            <button onClick={onRetry} style={{
                                ...btnBase,
                                backgroundColor: 'var(--bg-elevated)',
                                color: 'var(--text-primary)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                Try Again
                            </button>
                        )}
                        {(config as any).showReset && onReset && (
                            <button onClick={onReset} style={{
                                ...btnBase,
                                background: 'linear-gradient(135deg, var(--accent-terra) 0%, var(--accent-rose) 100%)',
                                color: '#fff',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                                Select Another Team
                            </button>
                        )}
                    </div>

                    {statusCode === 429 && (
                        <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'var(--text-secondary)' }}>Why this happens:</strong>{' '}
                                The Grid.gg hackathon API has rate limits. Your request will work again after a short wait.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export const InlineError: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
    <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: 'var(--accent-rose-dim)', border: '1px solid rgba(201,112,112,0.25)' }}
    >
        <div className="flex items-start gap-3">
            <AlertTriangle size={28} color="var(--accent-rose)" className="shrink-0 mt-0.5" />
            <div className="flex-1">
                <p style={{ fontSize: '18px', color: 'var(--accent-rose)' }}>{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        style={{ marginTop: '6px', fontSize: '18px', color: 'var(--text-secondary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Try again
                    </button>
                )}
            </div>
        </div>
    </div>
);