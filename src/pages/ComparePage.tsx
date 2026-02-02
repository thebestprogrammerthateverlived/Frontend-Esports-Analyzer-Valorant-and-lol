// ============================================================================
// COMPARE TEAMS PAGE - Side-by-side team comparison

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ComparisonSkeleton } from '../components/Shared/Skeletonloader';
import { ConfidenceBadgeWithTooltip } from '../components/Shared/Confidencebadge';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, ComparisonStats } from '../types/api';
import { TeamSelector } from '../components/Compare/TeamSelector';

interface ComparePageProps {
    currentGame: Game;
}

export const ComparePage: React.FC<ComparePageProps> = ({ currentGame }) => {
    const [team1, setTeam1] = useState<string>('');
    const [team2, setTeam2] = useState<string>('');
    const { showToast } = useToast();

    // Query comparison
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.compare({ team1, team2, game: currentGame }),
        queryFn: () => api.compare({ team1, team2, game: currentGame }),
        enabled: Boolean(team1 && team2),
        staleTime: 3600000,
    });

    // Handle errors
    React.useEffect(() => {
        if (error) {
            showToast('error', 'Comparison failed', (error as Error).message);
        }
    }, [error, showToast]);

    const accentColor = currentGame === Game.VALORANT ? 'red' : 'amber';

    // Determine winner based on win rate
    const getWinner = () => {
        if (!data) return null;
        return data.team1.stats.winRate > data.team2.stats.winRate ? data.team1.name : data.team2.name;
    };

    return (
        <PageWrapper
            title="Compare Teams"
            description="Head-to-head analysis with confidence scoring and insights"
        >
            {/* Team Selectors */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <TeamSelector
                    label="Team 1"
                    selectedTeam={team1}
                    onChange={setTeam1}
                    game={currentGame}
                    accentColor={accentColor}
                />
                <TeamSelector
                    label="Team 2"
                    selectedTeam={team2}
                    onChange={setTeam2}
                    game={currentGame}
                    accentColor={accentColor}
                />
            </div>

            {/* Comparison Results */}
            {isLoading ? (
                <ComparisonSkeleton />
            ) : data ? (
                <div className="space-y-6">
                    {/* Winner Prediction */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-6 rounded-xl border-2 bg-linear-to-br
              ${currentGame === Game.VALORANT
                                ? 'from-red-950/20 to-red-900/10 border-red-800/50'
                                : 'from-amber-950/20 to-amber-900/10 border-amber-800/50'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm text-zinc-400 mb-1">Statistical Advantage</h3>
                                <p className="text-2xl font-bold text-white">
                                    {getWinner()}
                                </p>
                            </div>
                            <ConfidenceBadgeWithTooltip
                                level={data.team1.stats.confidence.level}
                                size="lg"
                            />
                        </div>
                    </motion.div>

                    {/* Team Metrics Comparison */}
                    <div className="grid grid-cols-2 gap-6">
                        <TeamMetricsCard
                            name={data.team1.name}
                            stats={data.team1.stats}
                            accentColor={accentColor}
                            isWinner={getWinner() === data.team1.name}
                        />
                        <TeamMetricsCard
                            name={data.team2.name}
                            stats={data.team2.stats}
                            accentColor={accentColor}
                            isWinner={getWinner() === data.team2.name}
                        />
                    </div>

                    {/* Advantages */}
                    <div className="grid grid-cols-2 gap-6">
                        <AdvantagesCard
                            teamName={data.team1.name}
                            advantages={data.advantages?.team1 || []}
                            accentColor={accentColor}
                        />
                        <AdvantagesCard
                            teamName={data.team2.name}
                            advantages={data.advantages?.team2 || []}
                            accentColor={accentColor}
                        />
                    </div>

                    {/* Warnings */}
                    {data.warnings && data.warnings.length > 0 && (
                        <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Warnings</h4>
                            <ul className="space-y-1">
                                {data.warnings.map((warning, index) => (
                                    <li key={index} className="text-xs text-amber-300">
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : team1 && team2 ? (
                <div className="text-center py-12 text-zinc-500">
                    Loading comparison...
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    Select both teams to see comparison
                </div>
            )}
        </PageWrapper>
    );
};

// TEAM METRICS CARD

const TeamMetricsCard: React.FC<{
    name: string;
    stats: ComparisonStats;
    accentColor: string;
    isWinner: boolean;
}> = ({ name, stats, accentColor, isWinner }) => {
    const borderColor = isWinner
        ? (accentColor === 'red' ? 'border-red-600' : 'border-amber-600')
        : 'border-zinc-800/50';
    const badgeBg = accentColor === 'red'
        ? 'bg-gradient-to-r from-red-500 to-red-600'
        : 'bg-gradient-to-r from-amber-500 to-amber-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border bg-zinc-900/50 ${borderColor}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                </div>
                {isWinner && (
                    <div className={`px-2 py-1 ${badgeBg} rounded text-xs font-bold text-white`}>
                        ADVANTAGE
                    </div>
                )}
            </div>

            {/* Metrics */}
            <div className="space-y-4">
                <MetricRow
                    label="Win Rate"
                    value={`${(stats.winRate * 100).toFixed(1)}%`}
                    icon={stats.winRate >= 0.5 ? TrendingUp : TrendingDown}
                    trend={stats.winRate >= 0.5 ? 'positive' : 'negative'}
                />
                <MetricRow
                    label="K/D Ratio"
                    value={stats.kdRatio.toFixed(2)}
                    icon={stats.kdRatio >= 1.0 ? TrendingUp : TrendingDown}
                    trend={stats.kdRatio >= 1.0 ? 'positive' : 'negative'}
                />
                <MetricRow
                    label="Avg Kills"
                    value={stats.kills.avg.toFixed(1)}
                    icon={Minus}
                    trend="neutral"
                />
                <MetricRow
                    label="Avg Deaths"
                    value={stats.deaths.avg.toFixed(1)}
                    icon={Minus}
                    trend="neutral"
                />
                <MetricRow
                    label="Current Streak"
                    value={`${stats.currentStreak.count} ${stats.currentStreak.type}${stats.currentStreak.count > 1 ? 's' : ''}`}
                    icon={stats.currentStreak.type === 'win' ? TrendingUp : TrendingDown}
                    trend={stats.currentStreak.type === 'win' ? 'positive' : 'negative'}
                />
            </div>

            {/* Confidence */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Data Confidence</span>
                    <ConfidenceBadgeWithTooltip level={stats.confidence.level} />
                </div>
                <p className="text-xs text-zinc-600 mt-2">{stats.confidence.reasoning}</p>
            </div>
        </motion.div>
    );
};

// METRIC ROW

const MetricRow: React.FC<{
    label: string;
    value: string;
    icon: React.ElementType;
    trend: 'positive' | 'negative' | 'neutral';
}> = ({ label, value, icon: Icon, trend }) => {
    const colorClasses = {
        positive: 'text-emerald-400',
        negative: 'text-red-400',
        neutral: 'text-zinc-400',
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon size={16} className={colorClasses[trend]} />
                <span className="text-sm text-zinc-400">{label}</span>
            </div>
            <span className="text-lg font-semibold text-white">{value}</span>
        </div>
    );
};

// ADVANTAGES CARD

const AdvantagesCard: React.FC<{
    teamName: string;
    advantages: string[];
    accentColor: string;
}> = ({ teamName, advantages = [], accentColor }) => {
    const textColor = accentColor === 'red' ? 'text-red-400' : 'text-amber-400';

    return (
        <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-3">{teamName} Advantages</h4>
            {advantages && advantages.length > 0 ? (
                <ul className="space-y-2">
                    {advantages.map((advantage, index) => (
                        <li key={index} className={`text-sm ${textColor} flex items-start gap-2`}>
                            <span className="shrink-0">✓</span>
                            <span>{advantage}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-zinc-500">No significant advantages detected</p>
            )}
        </div>
    );
};