// ============================================================================
// SKELETON LOADER - Animated loading placeholders

import React from 'react';
import { motion } from 'motion/react';

// BASE SKELETON

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
}) => {
    const baseClasses = 'animate-pulse bg-zinc-800/50 overflow-hidden relative';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        >
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-zinc-700/20 to-transparent"
                animate={{
                    translateX: ['100%', '-100%'],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear',
                }}
            />
        </div>
    );
};

// PRESET LOADERS

export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-4">
            <Skeleton width="60%" height={24} />
            <Skeleton width="100%" height={60} />
            <div className="flex gap-2">
                <Skeleton width="30%" height={32} />
                <Skeleton width="30%" height={32} />
            </div>
        </div>
    );
};

export const SearchResultSkeleton: React.FC = () => {
    return (
        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton width="40%" height={20} />
                <Skeleton width="20%" height={16} />
            </div>
        </div>
    );
};

export const ComparisonSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((i) => (
                <div
                    key={i}
                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <Skeleton variant="circular" width={56} height={56} />
                        <div className="flex-1 space-y-2">
                            <Skeleton width="60%" height={24} />
                            <Skeleton width="40%" height={16} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton width="100%" height={40} />
                        <Skeleton width="100%" height={40} />
                        <Skeleton width="100%" height={40} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const TrendChartSkeleton: React.FC = () => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-4">
            <Skeleton width="40%" height={24} />
            <Skeleton width="100%" height={300} />
            <div className="flex gap-4">
                <Skeleton width="25%" height={16} />
                <Skeleton width="25%" height={16} />
                <Skeleton width="25%" height={16} />
            </div>
        </div>
    );
};

export const ScoutingReportSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                        <Skeleton width="50%" height={32} />
                        <Skeleton width="30%" height={20} />
                    </div>
                    <Skeleton variant="circular" width={80} height={80} />
                </div>
                <div className="flex gap-4">
                    <Skeleton width="30%" height={48} />
                    <Skeleton width="30%" height={48} />
                    <Skeleton width="30%" height={48} />
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Player highlights */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 space-y-4">
                <Skeleton width="40%" height={24} />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} width="100%" height={48} />
                    ))}
                </div>
            </div>
        </div>
    );
};