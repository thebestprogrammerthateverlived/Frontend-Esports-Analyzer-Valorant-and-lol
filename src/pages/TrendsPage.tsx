
// TRENDS PAGE - Performance trends analysis


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { TrendChartSkeleton } from '../components/Shared/Skeletonloader';
import { TeamSelector } from '../components/Compare/TeamSelector';
import { ErrorDisplay } from '../components/Shared/ErrorDisplay';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, TrendAlert } from '../types/api';

interface TrendsPageProps {
    currentGame: Game;
}

export const TrendsPage: React.FC<TrendsPageProps> = ({ currentGame }) => {
    const [teamName, setTeamName] = useState<string>('');
    const { showToast } = useToast();

    // Query trends
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.trends({ teamName, game: currentGame }),
        queryFn: () => api.trends({ teamName, game: currentGame }),
        enabled: Boolean(teamName),
        staleTime: 3600000,
    });

    // Handle errors with toast only for unexpected errors
    React.useEffect(() => {
        if (error && !(error as Error).message.includes('insufficient data')) {
            showToast('error', 'Failed to load trends', (error as Error).message);
        }
    }, [error, showToast]);

    const accentColor = currentGame === Game.VALORANT ? 'red' : 'amber';

    return (
        <PageWrapper
            title="Performance Trends"
            description="Track team performance over time with detailed insights"
        >
            {/* Team Selector */}
            <div className="max-w-md mb-8">
                <TeamSelector
                    label="Select Team"
                    selectedTeam={teamName}
                    onChange={setTeamName}
                    game={currentGame}
                    accentColor={accentColor}
                />
            </div>

            {/* Trends Display */}
            {isLoading ? (
                <TrendChartSkeleton />
            ) : data ? (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SummaryCard
                            title="Overall Performance"
                            subtitle={data.overall.timeWindow}
                            winRate={data.overall.winRate}
                            kdRatio={data.overall.kdRatio}
                            matches={data.overall.matches}
                        />
                        <SummaryCard
                            title="Recent Performance"
                            subtitle={data.recent.timeWindow}
                            winRate={data.recent.winRate}
                            kdRatio={data.recent.kdRatio}
                            matches={data.recent.matches}
                        />
                    </div>

                    {/* Alerts */}
                    {data.alerts && data.alerts.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Performance Alerts</h3>
                            <div className="space-y-3">
                                {data.alerts.map((alert, index) => (
                                    <AlertCard key={index} alert={alert} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Confidence Info */}
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-white">Analysis Confidence</h4>
                            <span className={`text-sm font-medium ${data.confidence.level === 'HIGH' ? 'text-emerald-400' :
                                    data.confidence.level === 'MEDIUM' ? 'text-amber-400' :
                                        'text-zinc-400'
                                }`}>
                                {data.confidence.level}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400">{data.confidence.reasoning}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-zinc-800 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full bg-linear-to-r ${currentGame === Game.VALORANT ? 'from-red-600 to-red-500' : 'from-amber-500 to-amber-400'
                                        }`}
                                    style={{ width: `${data.confidence.reliabilityScore}%` }}
                                />
                            </div>
                            <span className="text-xs text-zinc-500">{data.confidence.reliabilityScore}%</span>
                        </div>
                    </div>

                    {/* Comparison */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                            <h3 className="text-sm text-zinc-400 mb-4">Win Rate Comparison</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-500">Overall</span>
                                        <span className="text-sm font-semibold text-white">
                                            {(data.overall.winRate * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-zinc-600"
                                            style={{ width: `${data.overall.winRate * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-500">Recent</span>
                                        <span className="text-sm font-semibold text-white">
                                            {(data.recent.winRate * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-linear-to-r ${currentGame === Game.VALORANT ? 'from-red-600 to-red-500' : 'from-amber-500 to-amber-400'
                                                }`}
                                            style={{ width: `${data.recent.winRate * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                            <h3 className="text-sm text-zinc-400 mb-4">K/D Ratio Comparison</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-500">Overall</span>
                                        <span className="text-sm font-semibold text-white">
                                            {data.overall.kdRatio.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-zinc-600"
                                            style={{ width: `${Math.min(data.overall.kdRatio / 2 * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-zinc-500">Recent</span>
                                        <span className="text-sm font-semibold text-white">
                                            {data.recent.kdRatio.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-linear-to-r ${currentGame === Game.VALORANT ? 'from-red-600 to-red-500' : 'from-amber-500 to-amber-400'
                                                }`}
                                            style={{ width: `${Math.min(data.recent.kdRatio / 2 * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : error && teamName ? (
                <ErrorDisplay
                    error={error}
                    onRetry={() => window.location.reload()}
                    onReset={() => setTeamName('')}
                />
            ) : teamName ? (
                <div className="text-center py-12 text-zinc-500">
                    Loading trends...
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    Select a team to view trends
                </div>
            )}
        </PageWrapper>
    );
};


// SUMMARY CARD


const SummaryCard: React.FC<{
    title: string;
    subtitle: string;
    winRate: number;
    kdRatio: number;
    matches: number;
}> = ({ title, subtitle, winRate, kdRatio, matches }) => {
    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="text-xs text-zinc-500">{subtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Win Rate</p>
                    <p className="text-xl font-bold text-white">{(winRate * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">K/D Ratio</p>
                    <p className="text-xl font-bold text-white">{kdRatio.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Matches</p>
                    <p className="text-xl font-bold text-white">{matches}</p>
                </div>
            </div>
        </div>
    );
};


// ALERT CARD


const AlertCard: React.FC<{ alert: TrendAlert }> = ({ alert }) => {
    const getAlertStyles = () => {
        switch (alert.type) {
            case 'POSITIVE_SHIFT':
                return {
                    bg: 'bg-emerald-950/30',
                    border: 'border-emerald-800/50',
                    icon: TrendingUp,
                    iconColor: 'text-emerald-500',
                };
            case 'NEGATIVE_SHIFT':
                return {
                    bg: 'bg-red-950/30',
                    border: 'border-red-800/50',
                    icon: TrendingDown,
                    iconColor: 'text-red-500',
                };
            case 'PLAYSTYLE_CHANGE':
                return {
                    bg: 'bg-blue-950/30',
                    border: 'border-blue-800/50',
                    icon: AlertTriangle,
                    iconColor: 'text-blue-500',
                };
            default:
                return {
                    bg: 'bg-zinc-900/50',
                    border: 'border-zinc-800/50',
                    icon: Minus,
                    iconColor: 'text-zinc-500',
                };
        }
    };

    const styles = getAlertStyles();
    const Icon = styles.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 ${styles.bg} border ${styles.border} rounded-lg`}
        >
            <div className="flex items-start gap-3">
                <Icon size={20} className={`${styles.iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{alert.message}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${alert.severity === 'HIGH' ? 'bg-red-950/50 text-red-400' :
                                alert.severity === 'MEDIUM' ? 'bg-amber-950/50 text-amber-400' :
                                    'bg-zinc-800/50 text-zinc-400'
                            }`}>
                            {alert.severity}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400">{alert.context}</p>
                </div>
            </div>
        </motion.div>
    );
};