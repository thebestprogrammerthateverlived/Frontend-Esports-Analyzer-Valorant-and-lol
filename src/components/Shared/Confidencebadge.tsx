
// CONFIDENCE BADGE - Color-coded confidence indicators

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
        bgClass: 'bg-emerald-950/50 border-emerald-700/50',
        textClass: 'text-emerald-400',
        iconClass: 'text-emerald-500',
    },
    [ConfidenceLevel.MEDIUM]: {
        label: 'Medium Confidence',
        shortLabel: 'Medium',
        icon: AlertTriangle,
        bgClass: 'bg-amber-950/50 border-amber-700/50',
        textClass: 'text-amber-400',
        iconClass: 'text-amber-500',
    },
    [ConfidenceLevel.LOW]: {
        label: 'Low Confidence',
        shortLabel: 'Low',
        icon: HelpCircle,
        bgClass: 'bg-zinc-800/50 border-zinc-700/50',
        textClass: 'text-zinc-400',
        iconClass: 'text-zinc-500',
    },
};

const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
};

const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
    level,
    showIcon = true,
    size = 'md',
}) => {
    const config = confidenceConfig[level];
    const Icon = config.icon;

    return (
        <div
            className={`
        inline-flex items-center gap-1.5
        ${config.bgClass}
        ${sizeClasses[size]}
        border rounded-full font-medium
        ${config.textClass}
      `}
        >
            {showIcon && <Icon size={iconSizes[size]} className={config.iconClass} />}
            <span>{config.shortLabel}</span>
        </div>
    );
};

// Tooltip version with full explanation
export const ConfidenceBadgeWithTooltip: React.FC<ConfidenceBadgeProps> = ({
    level,
    showIcon = true,
    size = 'md',
}) => {
    const tooltipText = {
        [ConfidenceLevel.HIGH]: 'Based on 20+ recent matches',
        [ConfidenceLevel.MEDIUM]: 'Based on 10-19 recent matches',
        [ConfidenceLevel.LOW]: 'Based on <10 recent matches',
    };

    return (
        <div className="group relative inline-block">
            <ConfidenceBadge level={level} showIcon={showIcon} size={size} />
            <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                   opacity-0 group-hover:opacity-100 
                   pointer-events-none transition-opacity duration-200
                   z-50"
            >
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 whitespace-nowrap">
                    <p className="text-xs text-zinc-300">{tooltipText[level]}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-zinc-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};