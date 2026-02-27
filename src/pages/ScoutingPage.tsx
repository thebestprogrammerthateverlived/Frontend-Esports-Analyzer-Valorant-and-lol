// SCOUTING PAGE — Ember Console

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Shield, Target } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ScoutingReportSkeleton } from '../components/Shared/Skeletonloader';
import { ConfidenceBadgeWithTooltip } from '../components/Shared/Confidencebadge';
import { TeamSelector } from '../components/Compare/TeamSelector';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, KeyInsight } from '../types/api';

interface ScoutingPageProps { currentGame: Game; }

const PRIORITY: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const ScoutingPage: React.FC<ScoutingPageProps> = ({ currentGame }) => {
    const [opponent, setOpponent] = useState('');
    const [myTeam, setMyTeam] = useState('');
    const { showToast } = useToast();

    const isVal = currentGame === Game.VALORANT;
    const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
    const accentColor = isVal ? 'red' : 'terra';

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.scoutingReport({ opponent, myTeam, game: currentGame }),
        queryFn: () => api.scoutingReport({ opponent, myTeam, game: currentGame }),
        enabled: Boolean(opponent && myTeam),
        staleTime: 3_600_000,
    });

    React.useEffect(() => {
        if (error) showToast('error', 'Failed to load scouting report', (error as Error).message);
    }, [error, showToast]);

    return (
        <PageWrapper description="Pre-match breakdown with actionable insights">
            {/* Selectors */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                <TeamSelector label="Your Team" selectedTeam={myTeam} onChange={setMyTeam} game={currentGame} accentColor={accentColor} />
                <div className="flex items-end pb-1 justify-center">
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>VS</span>
                </div>
                <TeamSelector label="Opponent" selectedTeam={opponent} onChange={setOpponent} game={currentGame} accentColor={accentColor} />
            </div>

            {isLoading ? (
                <ScoutingReportSkeleton />
            ) : data ? (
                <div className="space-y-4">
                    {/* Report header */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl flex items-start justify-between"
                        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                    >
                        <div>
                            <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '26px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                {data.matchup.yourTeam} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>vs</span> {data.matchup.opponent}
                            </h2>
                            <p style={{ fontSize: '23px', color: 'var(--text-muted)' }}>
                                {new Date(data.generatedAt).toLocaleString()}
                                {data.cacheStatus.fromCache && <span style={{ color: 'var(--success)', marginLeft: '8px' }}>✓ cached ({data.cacheStatus.age})</span>}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <ConfidenceBadgeWithTooltip level={data.confidence.level} size="lg" />
                            <p style={{ fontSize: '23px', color: 'var(--text-muted)', textAlign: 'right', maxWidth: '220px' }}>{data.confidence.reasoning}</p>
                        </div>
                    </motion.div>

                    {/* Key insights feed */}
                    <div>
                        <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                            Key Insights
                        </p>
                        <div className="grid grid-cols-1 gap-2.5">
                            {[...data.keyInsights]
                                .sort((a: KeyInsight, b: KeyInsight) => (PRIORITY[a.priority] ?? 2) - (PRIORITY[b.priority] ?? 2))
                                .map((ins: KeyInsight, i: number) => (
                                    <InsightRow key={i} insight={ins} index={i} />
                                ))}
                        </div>
                    </div>

                    {/* Stats comparison */}
                    <div>
                        <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                            Statistical Comparison
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <StatsCard name={data.comparison.team1.name} stats={data.comparison.team1.stats} advantages={data.comparison.advantages?.team1 ?? []} gameColor={gameColor} />
                            <StatsCard name={data.comparison.team2.name} stats={data.comparison.team2.stats} advantages={data.comparison.advantages?.team2 ?? []} gameColor={gameColor} />
                        </div>
                    </div>

                    {/* Trends */}
                    {data.trends && (
                        <div>
                            <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                Recent Trends
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <TrendCard title={`${data.trends.yourTeam.team} (You)`} trends={data.trends.yourTeam} />
                                <TrendCard title={`${data.trends.opponent.team} (Opponent)`} trends={data.trends.opponent} />
                            </div>
                        </div>
                    )}

                    {/* Meta context */}
                    {data.metaContext && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Meta Context</p>
                            <div className="grid grid-cols-2 gap-5">
                                {[
                                    { label: 'Your Team vs Meta', items: data.metaContext.yourTeamVsMeta },
                                    { label: 'Opponent vs Meta', items: data.metaContext.opponentVsMeta },
                                ].map(col => (
                                    <div key={col.label}>
                                        <p style={{ fontSize: '21px', color: 'var(--text-muted)', marginBottom: '7px' }}>{col.label}</p>
                                        <ul className="space-y-1.5">
                                            {col.items.map((item: string, i: number) => (
                                                <li key={i} style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: '60px', fontSize: '23px', color: 'var(--text-muted)' }}>
                    {opponent && myTeam ? 'Generating report…' : 'Select both teams to generate a scouting report'}
                </div>
            )}
        </PageWrapper>
    );
};

// ── Insight row ───────────────────────────────────────────────────────────────
const INSIGHT_STYLES: Record<string, { bg: string; border: string; tag: string }> = {
    HIGH: { bg: 'var(--accent-rose-dim)', border: 'rgba(201,112,112,.22)', tag: 'var(--accent-rose)' },
    MEDIUM: { bg: 'var(--accent-terra-dim)', border: 'rgba(212,149,122,.22)', tag: 'var(--accent-terra)' },
    LOW: { bg: 'var(--bg-elevated)', border: 'var(--border)', tag: 'var(--text-muted)' },
};

const InsightRow: React.FC<{ insight: KeyInsight; index: number }> = ({ insight, index }) => {
    const s = INSIGHT_STYLES[insight.priority] ?? INSIGHT_STYLES.LOW;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}
            className="flex items-start gap-3 p-3.5 rounded-lg"
            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
        >
            <span style={{ fontSize: '23px', flexShrink: 0, lineHeight: 1.3 }}>{insight.icon}</span>
            <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.12em', padding: '1px 6px', borderRadius: '3px', backgroundColor: s.bg, color: s.tag, display: 'inline-block', marginBottom: '5px' }}>
                    {insight.priority}
                </span>
                <p style={{ fontSize: '21px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{insight.message}</p>
            </div>
        </motion.div>
    );
};

// ── Stats card ────────────────────────────────────────────────────────────────
const StatsCard: React.FC<{ name: string; stats: any; advantages: string[]; gameColor: string }> = ({
    name, stats, advantages, gameColor,
}) => (
    <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '12px' }}>{name}</h4>
        <div className="space-y-2.5 mb-4">
            {[
                { label: 'Win Rate', val: `${(stats.winRate * 100).toFixed(1)}%` },
                { label: 'K/D', val: stats.kdRatio.toFixed(2) },
                { label: 'Avg Kills', val: stats.kills.avg.toFixed(1) },
            ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
                </div>
            ))}
        </div>
        {advantages.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <p style={{ fontSize: '21px', fontFamily: 'Rajdhani,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '7px' }}>Advantages</p>
                <ul className="space-y-1.5">
                    {advantages.map((a: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5" style={{ fontSize: '21px' }}>
                            <span style={{ color: gameColor }}>✓</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{a}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

// ── Trend card ────────────────────────────────────────────────────────────────
const TrendCard: React.FC<{ title: string; trends: any }> = ({ title, trends }) => (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h4>
        <div className="grid grid-cols-2 gap-3 mb-4">
            {[
                { label: 'Overall', val: `${(trends.overall.winRate * 100).toFixed(1)}%` },
                { label: 'Recent', val: `${(trends.recent.winRate * 100).toFixed(1)}%` },
            ].map(({ label, val }) => (
                <div key={label}>
                    <p style={{ fontSize: '21px', fontFamily: 'Rajdhani,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>{label}</p>
                    <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</p>
                </div>
            ))}
        </div>
        {trends.alerts?.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }} className="space-y-2">
                {trends.alerts.slice(0, 2).map((a: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                        {a.type === 'POSITIVE_SHIFT' && <TrendingUp size={32} color="var(--success)" />}
                        {a.type === 'NEGATIVE_SHIFT' && <TrendingDown size={32} color="var(--accent-rose)" />}
                        {a.type === 'PLAYSTYLE_CHANGE' && <Target size={32} color="var(--info)" />}
                        {a.type === 'CONSISTENCY' && <Shield size={32} color="var(--text-muted)" />}
                        <p style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{a.message}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
);