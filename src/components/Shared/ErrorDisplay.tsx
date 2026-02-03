
// ERROR DISPLAY COMPONENT - Shows user-friendly error messages


import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    AlertCircle,
    Clock,
    Database,
    Wifi,
    Server,
    XCircle
} from 'lucide-react';

export interface ErrorDisplayProps {
    error: Error | any;
    onRetry?: () => void;
    onReset?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    error,
    onRetry,
    onReset
}) => {
    // Parse error details
    const statusCode = error?.statusCode || error?.status || 500;
    const message = error?.message || 'An unexpected error occurred';
    const details = error?.details;
    const retryAfter = error?.retryAfter;

    // Determine error type and styling
    const getErrorConfig = () => {
        // Rate Limit (429 or detected in 500)
        if (statusCode === 429 || message.toLowerCase().includes('rate limit')) {
            return {
                icon: Clock,
                iconColor: 'text-amber-500',
                borderColor: 'border-amber-800/50',
                bgColor: 'bg-amber-950/30',
                title: 'API Rate Limit Exceeded',
                message: 'The Grid.gg API has limited requests per minute.',
                details: retryAfter
                    ? `Please wait ${retryAfter} before trying again.`
                    : 'Please wait a moment and try again.',
                showRetry: true,
                retryDelay: 5000, // Show countdown
            };
        }

        // Insufficient Data (404 with specific message)
        if (statusCode === 404 && (
            message.includes('insufficient data') ||
            message.includes('no recent matches')
        )) {
            return {
                icon: Database,
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-800/50',
                bgColor: 'bg-blue-950/30',
                title: 'No Recent Match Data',
                message: message,
                details: 'This team hasn\'t played in the last 3 months. The Grid.gg API has limited historical data.',
                showRetry: false,
                showReset: true,
            };
        }

        // Not Found (404)
        if (statusCode === 404) {
            return {
                icon: XCircle,
                iconColor: 'text-zinc-500',
                borderColor: 'border-zinc-800/50',
                bgColor: 'bg-zinc-950/30',
                title: 'Not Found',
                message: message,
                details: details || 'The requested resource was not found.',
                showRetry: false,
                showReset: true,
            };
        }

        // Network Error (0 or no response)
        if (statusCode === 0 || message.includes('Network error')) {
            return {
                icon: Wifi,
                iconColor: 'text-red-500',
                borderColor: 'border-red-800/50',
                bgColor: 'bg-red-950/30',
                title: 'Connection Failed',
                message: 'Unable to connect to the API server.',
                details: 'Please check your internet connection or try again later.',
                showRetry: true,
            };
        }

        // Timeout (504)
        if (statusCode === 504 || message.includes('timeout')) {
            return {
                icon: Clock,
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-800/50',
                bgColor: 'bg-orange-950/30',
                title: 'Request Timeout',
                message: 'The server is taking too long to respond.',
                details: 'This usually happens during cache misses. Please try again.',
                showRetry: true,
            };
        }

        // Service Unavailable (503)
        if (statusCode === 503) {
            return {
                icon: Server,
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-800/50',
                bgColor: 'bg-purple-950/30',
                title: 'Service Unavailable',
                message: 'The API server is temporarily unavailable.',
                details: 'Please try again in a few moments.',
                showRetry: true,
            };
        }

        // Generic Error (500 or other)
        return {
            icon: AlertCircle,
            iconColor: 'text-red-500',
            borderColor: 'border-red-800/50',
            bgColor: 'bg-red-950/30',
            title: 'Something Went Wrong',
            message: message,
            details: details || 'An unexpected error occurred. Please try again.',
            showRetry: true,
        };
    };

    const config = getErrorConfig();
    const Icon = config.icon;

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 bg-zinc-900/50 border ${config.borderColor} rounded-xl`}
            >
                <div className="text-center">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} border ${config.borderColor} mb-4`}>
                        <Icon size={32} className={config.iconColor} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-3">
                        {config.title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-zinc-400 mb-2">
                        {config.message}
                    </p>

                    {/* Details */}
                    {config.details && (
                        <p className="text-xs text-zinc-500 mb-6">
                            {config.details}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-3">
                        {config.showRetry && onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        )}

                        {config.showReset && onReset && (
                            <button
                                onClick={onReset}
                                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                            >
                                Select Another Team
                            </button>
                        )}
                    </div>

                    {/* Additional Info */}
                    {statusCode === 429 && (
                        <div className="mt-4 pt-4 border-t border-zinc-800">
                            <p className="text-xs text-zinc-600">
                                <strong>Why this happens:</strong> The Grid.gg hackathon API has rate limits.
                                Your request will work again after a short wait.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};


// INLINE ERROR (For smaller error states)


export const InlineError: React.FC<{ message: string; onRetry?: () => void }> = ({
    message,
    onRetry
}) => {
    return (
        <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
            <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm text-red-400">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};