
// SCOUTING REPORT PAGE - Comprehensive team analysis

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Shield,
    Target,
} from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ScoutingReportSkeleton } from '../components/Shared/Skeletonloader';
import { ConfidenceBadgeWithTooltip } from '../components/Shared/Confidencebadge';
import { TeamSelector } from '../components/Compare/TeamSelector';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, KeyInsight } from '../types/api';

interface ScoutingPageProps {
    currentGame: Game;
}

export const ScoutingPage: React.FC<ScoutingPageProps> = ({ currentGame }) => {
    const [opponent, setOpponent] = useState<string>('');
    const [myTeam, setMyTeam] = useState<string>('');
    const { showToast } = useToast();

    // Query scouting report
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.scoutingReport({ opponent, myTeam, game: currentGame }),
        queryFn: () => api.scoutingReport({ opponent, myTeam, game: currentGame }),
        enabled: Boolean(opponent && myTeam),
        staleTime: 3600000,
    });

    // Handle errors
    React.useEffect(() => {
        if (error) {
            showToast('error', 'Failed to load scouting report', (error as Error).message);
        }
    }, [error, showToast]);

    const accentColor = currentGame === Game.VALORANT ? 'red' : 'amber';

    return (
        <PageWrapper
            title="Scouting Report"
            description="Comprehensive pre-match analysis with key insights"
        >
            {/* Team Selectors */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <TeamSelector
                    label="Your Team"
                    selectedTeam={myTeam}
                    onChange={setMyTeam}
                    game={currentGame}
                    accentColor={accentColor}
                />
                <TeamSelector
                    label="Opponent"
                    selectedTeam={opponent}
                    onChange={setOpponent}
                    game={currentGame}
                    accentColor={accentColor}
                />
            </div>

            {/* Report */}
            {isLoading ? (
                <ScoutingReportSkeleton />
            ) : data ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {data.matchup.yourTeam} vs {data.matchup.opponent}
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Generated: {new Date(data.generatedAt).toLocaleString()}
                                </p>
                                {data.cacheStatus.fromCache && (
                                    <p className="text-xs text-emerald-500 mt-1">
                                        ✓ Cached report (Age: {data.cacheStatus.age})
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <ConfidenceBadgeWithTooltip level={data.confidence.level} size="lg" />
                                <p className="text-xs text-zinc-500 text-right max-w-xs">
                                    {data.confidence.reasoning}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Insights */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Key Insights
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {data.keyInsights
                                .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
                                .map((insight, index) => (
                                    <InsightCard
                                        key={index}
                                        insight={insight}
                                        index={index}
                                        accentColor={accentColor}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Comparison Stats */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Statistical Comparison
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <TeamStatsCard
                                name={data.comparison.team1.name}
                                stats={data.comparison.team1.stats}
                                advantages={data.comparison.advantages?.team1 || []}
                                accentColor={accentColor}
                            />
                            <TeamStatsCard
                                name={data.comparison.team2.name}
                                stats={data.comparison.team2.stats}
                                advantages={data.comparison.advantages?.team2 || []}
                                accentColor={accentColor}
                            />
                        </div>
                    </div>

                    {/* Trends Analysis */}
                    {data.trends && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Recent Trends
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <TrendCard
                                    title={`${data.trends.yourTeam.team} (Your Team)`}
                                    trends={data.trends.yourTeam}
                                    accentColor={accentColor}
                                />
                                <TrendCard
                                    title={`${data.trends.opponent.team} (Opponent)`}
                                    trends={data.trends.opponent}
                                    accentColor={accentColor}
                                />
                            </div>
                        </div>
                    )}

                    {/* Meta Context */}
                    {data.metaContext && (
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-white mb-3">Meta Analysis</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500 mb-2">Your Team vs Meta</p>
                                    <ul className="space-y-1">
                                        {data.metaContext.yourTeamVsMeta.map((item, i) => (
                                            <li key={i} className="text-xs text-zinc-400">• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 mb-2">Opponent vs Meta</p>
                                    <ul className="space-y-1">
                                        {data.metaContext.opponentVsMeta.map((item, i) => (
                                            <li key={i} className="text-xs text-zinc-400">• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : opponent && myTeam ? (
                <div className="text-center py-12 text-zinc-500">
                    Loading scouting report...
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    Select both teams to generate a scouting report
                </div>
            )}
        </PageWrapper>
    );
};

// PRIORITY ORDER

const priorityOrder: Record<string, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
};

// INSIGHT CARD

const InsightCard: React.FC<{
    insight: KeyInsight;
    index: number;
    accentColor: string;
}> = ({ insight, index, }) => {
    const priorityStyles: Record<string, { bg: string; border: string; text: string }> = {
        HIGH: {
            bg: 'bg-red-950/30',
            border: 'border-red-800/50',
            text: 'text-red-400',
        },
        MEDIUM: {
            bg: 'bg-amber-950/30',
            border: 'border-amber-800/50',
            text: 'text-amber-400',
        },
        LOW: {
            bg: 'bg-zinc-900/50',
            border: 'border-zinc-800/50',
            text: 'text-zinc-400',
        },
    };

    const styles = priorityStyles[insight.priority] || priorityStyles.LOW;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 ${styles.bg} border ${styles.border} rounded-lg`}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{insight.icon}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${styles.bg} ${styles.text} font-medium`}>
                            {insight.priority}
                        </span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">
                        {insight.message}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// TEAM STATS CARD

const TeamStatsCard: React.FC<{
    name: string;
    stats: any;
    advantages: string[];
    accentColor: string;
}> = ({ name, stats, advantages = [], accentColor }) => {
    const advantageColor = accentColor === 'red' ? 'text-red-400' : 'text-amber-400';

    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">{name}</h4>

            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Win Rate</span>
                    <span className="text-lg font-semibold text-white">
                        {(stats.winRate * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">K/D Ratio</span>
                    <span className="text-lg font-semibold text-white">
                        {stats.kdRatio.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Avg Kills</span>
                    <span className="text-lg font-semibold text-white">
                        {stats.kills.avg.toFixed(1)}
                    </span>
                </div>
            </div>

            {advantages && advantages.length > 0 && (
                <div className="pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-2">Advantages</p>
                    <ul className="space-y-1">
                        {advantages.map((adv, i) => (
                            <li key={i} className={`text-xs ${advantageColor} flex items-start gap-2`}>
                                <span>✓</span>
                                <span>{adv}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// TREND CARD

const TrendCard: React.FC<{
    title: string;
    trends: any;
    accentColor: string;
}> = ({ title, trends, }) => {
    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
            <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Overall Win Rate</p>
                    <p className="text-xl font-bold text-white">
                        {(trends.overall.winRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-1">Recent Win Rate</p>
                    <p className="text-xl font-bold text-white">
                        {(trends.recent.winRate * 100).toFixed(1)}%
                    </p>
                </div>
            </div>

            {trends.alerts && trends.alerts.length > 0 && (
                <div className="pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-2">Alerts</p>
                    <div className="space-y-2">
                        {trends.alerts.slice(0, 2).map((alert: any, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                                {alert.type === 'POSITIVE_SHIFT' && <TrendingUp size={14} className="text-emerald-500 shrink-0 mt-0.5" />}
                                {alert.type === 'NEGATIVE_SHIFT' && <TrendingDown size={14} className="text-red-500 shrink-0 mt-0.5" />}
                                {alert.type === 'PLAYSTYLE_CHANGE' && <Target size={14} className="text-blue-500 shrink-0 mt-0.5" />}
                                {alert.type === 'CONSISTENCY' && <Shield size={14} className="text-zinc-500 shrink-0 mt-0.5" />}
                                <p className="text-xs text-zinc-400">{alert.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};