// COMPARE PAGE — Ember Console

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ComparisonSkeleton } from '../components/Shared/Skeletonloader';
import { ConfidenceBadgeWithTooltip } from '../components/Shared/Confidencebadge';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, ComparisonStats } from '../types/api';
import { TeamSelector } from '../components/Compare/TeamSelector';

// ── Local shape of the compare API response ─────────────────────────────────
interface TeamData { name: string; stats: ComparisonStats; }
interface CompareData {
    team1: TeamData;
    team2: TeamData;
    advantages?: { team1?: string[]; team2?: string[] };
    warnings?: string[];
}

interface ComparePageProps { currentGame: Game; }

export const ComparePage: React.FC<ComparePageProps> = ({ currentGame }) => {
    const [team1, setTeam1] = useState('');
    const [team2, setTeam2] = useState('');
    const { showToast } = useToast();

    const isVal = currentGame === Game.VALORANT;
    const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
    const gameDim = isVal ? 'var(--game-val-dim)' : 'var(--game-lol-dim)';
    const accentColor = isVal ? 'red' : 'terra';

    const { data, isLoading, error } = useQuery<CompareData>({
        queryKey: queryKeys.compare({ team1, team2, game: currentGame }),
        queryFn: () => api.compare({ team1, team2, game: currentGame }),
        enabled: Boolean(team1 && team2),
        staleTime: 3_600_000,
    });

    React.useEffect(() => {
        if (error) showToast('error', 'Comparison failed', (error as Error).message);
    }, [error, showToast]);

    const winner = data
        ? (data.team1.stats.winRate >= data.team2.stats.winRate ? data.team1.name : data.team2.name)
        : null;

    return (
        <PageWrapper description="Side-by-side statistical comparison">
            {/* ── Selector row ── */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                <TeamSelector label="Team 1" selectedTeam={team1} onChange={setTeam1} game={currentGame} accentColor={accentColor} />

                {/* VS badge */}
                <div className="flex items-end pb-1 justify-center">
                    <span style={{
                        fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700,
                        letterSpacing: '0.12em', color: 'var(--text-muted)',
                        padding: '6px 10px', borderRadius: '6px',
                        backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    }}>VS</span>
                </div>

                <TeamSelector label="Team 2" selectedTeam={team2} onChange={setTeam2} game={currentGame} accentColor={accentColor} />
            </div>

            {/* ── Content ── */}
            {isLoading ? (
                <ComparisonSkeleton />
            ) : data ? (
                <div className="space-y-4">
                    {/* Advantage banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: `linear-gradient(135deg,${gameDim} 0%,transparent 100%)`, border: `1px solid ${gameColor}44` }}
                    >
                        <div>
                            <p style={{ fontSize: '17px', fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>Statistical Advantage</p>
                            <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>{winner}</p>
                        </div>
                        <ConfidenceBadgeWithTooltip level={data.team1.stats.confidence.level} size="lg" />
                    </motion.div>

                    {/* Side-by-side cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <MetricsCard name={data.team1.name} stats={data.team1.stats} gameColor={gameColor} gameDim={gameDim} isWinner={winner === data.team1.name} />
                        <MetricsCard name={data.team2.name} stats={data.team2.stats} gameColor={gameColor} gameDim={gameDim} isWinner={winner === data.team2.name} />
                    </div>

                    {/* Advantages */}
                    <div className="grid grid-cols-2 gap-4">
                        <AdvCard teamName={data.team1.name} advantages={data.advantages?.team1 ?? []} gameColor={gameColor} />
                        <AdvCard teamName={data.team2.name} advantages={data.advantages?.team2 ?? []} gameColor={gameColor} />
                    </div>

                    {/* Warnings */}
                    {(data.warnings ?? []).length > 0 && (
                        <div className="p-3.5 rounded-lg" style={{ backgroundColor: 'var(--accent-terra-dim)', border: '1px solid rgba(212,149,122,0.22)' }}>
                            <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '17px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent-terra)', marginBottom: '6px' }}>⚠ WARNINGS</p>
                            <ul className="space-y-1">
                                {(data.warnings ?? []).map((w: string, i: number) => (
                                    <li key={i} style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: '60px', fontSize: '23px', color: 'var(--text-muted)' }}>
                    {team1 && team2 ? 'Loading…' : 'Select both teams to compare'}
                </div>
            )}
        </PageWrapper>
    );
};

// ── Metrics card ─────────────────────────────────────────────────────────────
const MetricsCard: React.FC<{ name: string; stats: ComparisonStats; gameColor: string; gameDim: string; isWinner: boolean }> = ({
    name, stats, gameColor, gameDim, isWinner,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl"
        style={{
            backgroundColor: 'var(--bg-card)',
            border: `1px solid ${isWinner ? gameColor + '55' : 'var(--border)'}`,
            boxShadow: isWinner ? `0 0 28px ${gameDim}` : 'none',
        }}
    >
        <div className="flex items-start justify-between mb-4">
            <h3 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--text-primary)' }}>{name}</h3>
            {isWinner && (
                <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.12em', padding: '2px 7px', borderRadius: '4px', background: `linear-gradient(135deg,${gameColor},${gameColor}bb)`, color: '#fff' }}>
                    AHEAD
                </span>
            )}
        </div>
        <div className="space-y-3">
            <Metric label="Win Rate" value={`${(stats.winRate * 100).toFixed(1)}%`} up={stats.winRate >= 0.5} />
            <Metric label="K/D" value={stats.kdRatio.toFixed(2)} up={stats.kdRatio >= 1} />
            <Metric label="Avg Kills" value={stats.kills.avg.toFixed(1)} neutral />
            <Metric label="Avg Deaths" value={stats.deaths.avg.toFixed(1)} neutral />
            <Metric label="Streak"
                value={`${stats.currentStreak.count}W streak`}
                up={stats.currentStreak.type === 'win'}
            />
        </div>
        <div className="mt-4 pt-3.5 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Confidence</span>
            <ConfidenceBadgeWithTooltip level={stats.confidence.level} />
        </div>
    </motion.div>
);

const Metric: React.FC<{ label: string; value: string; up?: boolean; neutral?: boolean }> = ({ label, value, up, neutral }) => {
    const Icon = neutral ? Minus : up ? TrendingUp : TrendingDown;
    const color = neutral ? 'var(--text-muted)' : up ? 'var(--success)' : 'var(--accent-rose)';
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon size={28} color={color} strokeWidth={2.5} />
                <span style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
        </div>
    );
};

const AdvCard: React.FC<{ teamName: string; advantages: string[]; gameColor: string }> = ({ teamName, advantages, gameColor }) => (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '17px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>{teamName} Advantages</p>
        {advantages.length > 0 ? (
            <ul className="space-y-2">
                {advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span style={{ color: gameColor, fontSize: '23px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        <span style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{a}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p style={{ fontSize: '21px', color: 'var(--text-muted)' }}>No significant advantages detected</p>
        )}
    </div>
);