// CONFIDENCE BADGE — Ember Console theme

import React from 'react';
import { ConfidenceLevel } from '../../types/api';
import { Shield, AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
    level: ConfidenceLevel;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const confidenceConfig = {
    [ConfidenceLevel.HIGH]: {
        label: 'High Confidence',
        shortLabel: 'High',
        icon: Shield,
        className: 'badge-success',
        iconColor: '#5E9E7E',
    },
    [ConfidenceLevel.MEDIUM]: {
        label: 'Medium Confidence',
        shortLabel: 'Medium',
        icon: AlertTriangle,
        className: 'badge-warning',
        iconColor: 'var(--accent-terra)',
    },
    [ConfidenceLevel.LOW]: {
        label: 'Low Confidence',
        shortLabel: 'Low',
        icon: HelpCircle,
        className: 'badge-neutral',
        iconColor: 'var(--text-muted)',
    },
};

const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-2.5 py-1.5',
    lg: 'px-3.5 py-2',
};
const textSizes = {
    sm: '11px',
    md: '12px',
    lg: '13px',
};
const iconSizes = { sm: 11, md: 13, lg: 15 };

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
    level,
    showIcon = true,
    size = 'md',
}) => {
    const config = confidenceConfig[level];
    const Icon = config.icon;

    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}
            style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: textSizes[size], letterSpacing: '0.04em' }}
        >
            {showIcon && <Icon size={iconSizes[size]} color={config.iconColor} strokeWidth={2.5} />}
            <span>{config.shortLabel}</span>
        </div>
    );
};

export const ConfidenceBadgeWithTooltip: React.FC<ConfidenceBadgeProps> = ({
    level,
    showIcon = true,
    size = 'md',
}) => {
    const tooltipText = {
        [ConfidenceLevel.HIGH]:   'Based on 20+ recent matches',
        [ConfidenceLevel.MEDIUM]: 'Based on 10–19 recent matches',
        [ConfidenceLevel.LOW]:    'Based on <10 recent matches',
    };

    return (
        <div className="group relative inline-block">
            <ConfidenceBadge level={level} showIcon={showIcon} size={size} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div
                    className="rounded-lg px-3 py-2 whitespace-nowrap"
                    style={{
                        backgroundColor: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-hover)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                >
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                        {tooltipText[level]}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div
                            className="border-4 border-transparent"
                            style={{ borderTopColor: 'var(--border-hover)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};