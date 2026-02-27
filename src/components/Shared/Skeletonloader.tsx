// SKELETON LOADER — theme-aware animated placeholders

import React from 'react';
import { motion } from 'motion/react';

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
    const radius = variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px';
    return (
        <div
            className={`animate-pulse ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: radius,
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
            }}
        >
            <motion.div
                className="skeleton-shine"
                animate={{ translateX: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
            />
        </div>
    );
};

// ── Prebuilt skeletons ──────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
};

export const CardSkeleton: React.FC = () => (
    <div style={CARD} className="space-y-3">
        <Skeleton width="52%" height={20} />
        <Skeleton width="100%" height={56} />
        <div className="flex gap-2"><Skeleton width="30%" height={28} /><Skeleton width="30%" height={28} /></div>
    </div>
);

export const SearchResultSkeleton: React.FC = () => (
    <div className="flex items-center gap-4 p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
            <Skeleton width="38%" height={16} />
            <Skeleton width="20%" height={12} />
        </div>
    </div>
);

export const ComparisonSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 gap-5">
        {[1, 2].map(i => (
            <div key={i} style={CARD} className="space-y-5">
                <div className="flex items-center gap-4">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1 space-y-2"><Skeleton width="55%" height={20} /><Skeleton width="35%" height={13} /></div>
                </div>
                <div className="space-y-2.5">
                    <Skeleton width="100%" height={36} />
                    <Skeleton width="100%" height={36} />
                    <Skeleton width="100%" height={36} />
                </div>
            </div>
        ))}
    </div>
);

export const TrendChartSkeleton: React.FC = () => (
    <div style={CARD} className="space-y-4">
        <Skeleton width="36%" height={20} />
        <Skeleton width="100%" height={260} />
        <div className="flex gap-4"><Skeleton width="22%" height={13} /><Skeleton width="22%" height={13} /><Skeleton width="22%" height={13} /></div>
    </div>
);

export const ScoutingReportSkeleton: React.FC = () => (
    <div className="space-y-5">
        <div style={CARD} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2"><Skeleton width="46%" height={28} /><Skeleton width="26%" height={16} /></div>
                <Skeleton variant="circular" width={64} height={64} />
            </div>
            <div className="flex gap-4"><Skeleton width="26%" height={42} /><Skeleton width="26%" height={42} /><Skeleton width="26%" height={42} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">{[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}</div>
        <div style={CARD} className="space-y-3">
            <Skeleton width="36%" height={20} />
            {[1, 2, 3].map(i => <Skeleton key={i} width="100%" height={44} />)}
        </div>
    </div>
);

// ── Full-page skeleton for Suspense fallback ────────────────────────────────
export const PageSkeleton: React.FC = () => (
    <div style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto' }} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
            <Skeleton width="100%" height={46} />
            <Skeleton width="100%" height={46} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
        </div>
        <TrendChartSkeleton />
    </div>
);