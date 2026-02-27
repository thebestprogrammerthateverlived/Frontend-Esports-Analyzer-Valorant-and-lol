// TRENDS PAGE — Ember Console

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { TrendChartSkeleton } from '../components/Shared/Skeletonloader';
import { TeamSelector } from '../components/Compare/TeamSelector';
import { ErrorDisplay } from '../components/Shared/ErrorDisplay';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, TrendAlert } from '../types/api';

interface TrendsPageProps { currentGame: Game; }

export const TrendsPage: React.FC<TrendsPageProps> = ({ currentGame }) => {
  const [teamName, setTeamName] = useState('');
  const { showToast } = useToast();

  const isVal = currentGame === Game.VALORANT;
  const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
  const accentColor = isVal ? 'red' : 'terra';

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.trends({ teamName, game: currentGame }),
    queryFn: () => api.trends({ teamName, game: currentGame }),
    enabled: Boolean(teamName),
    staleTime: 3_600_000,
  });

  React.useEffect(() => {
    if (error && !(error as Error).message.includes('insufficient data')) {
      showToast('error', 'Failed to load trends', (error as Error).message);
    }
  }, [error, showToast]);

  return (
    <PageWrapper description="Track win rate and K/D over time">
      {/* Selector */}
      <div style={{ maxWidth: '360px', marginBottom: '24px' }}>
        <TeamSelector label="Select Team" selectedTeam={teamName} onChange={setTeamName} game={currentGame} accentColor={accentColor} />
      </div>

      {isLoading ? (
        <TrendChartSkeleton />
      ) : data ? (
        <div className="space-y-4">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-4">
            <KpiCard
              title="Overall" subtitle={data.overall.timeWindow}
              winRate={data.overall.winRate} kd={data.overall.kdRatio} matches={data.overall.matches}
              gameColor="var(--text-muted)"
            />
            <KpiCard
              title="Recent" subtitle={data.recent.timeWindow}
              winRate={data.recent.winRate} kd={data.recent.kdRatio} matches={data.recent.matches}
              gameColor={gameColor} highlight
            />
          </div>

          {/* Delta comparison bars */}
          <div className="grid grid-cols-2 gap-4">
            <BarCompare title="Win Rate" overall={data.overall.winRate} recent={data.recent.winRate} gameColor={gameColor} format={v => `${(v * 100).toFixed(1)}%`} />
            <BarCompare title="K/D Ratio" overall={data.overall.kdRatio} recent={data.recent.kdRatio} gameColor={gameColor} format={v => v.toFixed(2)} max={2} />
          </div>

          {/* Alerts */}
          {(data.alerts?.length ?? 0) > 0 && (
            <div>
              <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Performance Alerts
              </p>
              <div className="space-y-2">
                {data.alerts.map((a: TrendAlert, i: number) => <AlertCard key={i} alert={a} />)}
              </div>
            </div>
          )}

          {/* Confidence bar */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                Data Confidence
              </span>
              <span style={{
                fontSize: '23px', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700,
                color: data.confidence.level === 'HIGH' ? 'var(--success)' : data.confidence.level === 'MEDIUM' ? 'var(--accent-terra)' : 'var(--text-muted)',
              }}>
                {data.confidence.level}
              </span>
            </div>
            <p style={{ fontSize: '21px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{data.confidence.reasoning}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 progress-track" style={{ height: '5px' }}>
                <div style={{ height: '100%', borderRadius: '3px', width: `${data.confidence.reliabilityScore}%`, background: `linear-gradient(90deg,${gameColor},${gameColor}88)`, transition: 'width .5s ease' }} />
              </div>
              <span style={{ fontSize: '18px', color: 'var(--text-muted)', flexShrink: 0 }}>{data.confidence.reliabilityScore}%</span>
            </div>
          </div>
        </div>
      ) : error && teamName ? (
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} onReset={() => setTeamName('')} />
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '60px', fontSize: '18px', color: 'var(--text-muted)' }}>
          {teamName ? 'Loading…' : 'Select a team to view trends'}
        </div>
      )}
    </PageWrapper>
  );
};

// ── KPI card ─────────────────────────────────────────────────────────────────
const KpiCard: React.FC<{ title: string; subtitle: string; winRate: number; kd: number; matches: number; gameColor: string; highlight?: boolean }> = ({
  title, subtitle, winRate, kd, matches, gameColor, highlight,
}) => (
  <div className="p-5 rounded-xl" style={{
    backgroundColor: 'var(--bg-card)',
    border: `1px solid ${highlight ? gameColor + '44' : 'var(--border)'}`,
    boxShadow: highlight ? `0 0 20px ${gameColor}18` : 'none',
  }}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>{title}</p>
        <p style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>
      {highlight && (
        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '16px', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 7px', borderRadius: '4px', background: gameColor, color: '#fff' }}>
          RECENT
        </span>
      )}
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'Win Rate', val: `${(winRate * 100).toFixed(1)}%` },
        { label: 'K/D', val: kd.toFixed(2) },
        { label: 'Matches', val: String(matches) },
      ].map(({ label, val }) => (
        <div key={label}>
          <p style={{ fontSize: '17px', fontFamily: 'Rajdhani,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>{label}</p>
          <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '23px', fontWeight: 700, color: highlight ? gameColor : 'var(--text-primary)' }}>{val}</p>
        </div>
      ))}
    </div>
  </div>
);

// ── Bar comparison ────────────────────────────────────────────────────────────
const BarCompare: React.FC<{ title: string; overall: number; recent: number; gameColor: string; format: (v: number) => string; max?: number }> = ({
  title, overall, recent, gameColor, format, max = 1,
}) => (
  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
    <p style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '17px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '14px' }}>{title}</p>
    {[
      { label: 'Overall', value: overall, accent: false },
      { label: 'Recent', value: recent, accent: true },
    ].map(row => (
      <div key={row.label} style={{ marginBottom: '12px' }}>
        <div className="flex justify-between mb-1.5">
          <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{row.label}</span>
          <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 600, color: row.accent ? gameColor : 'var(--text-primary)' }}>{format(row.value)}</span>
        </div>
        <div className="progress-track" style={{ height: '4px' }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            width: `${Math.min(row.value / max, 1) * 100}%`,
            background: row.accent ? `linear-gradient(90deg,${gameColor},${gameColor}88)` : 'var(--bg-elevated)',
            transition: 'width .5s ease',
          }} />
        </div>
      </div>
    ))}
  </div>
);

// ── Alert card ────────────────────────────────────────────────────────────────
const AlertCard: React.FC<{ alert: TrendAlert }> = ({ alert }) => {
  const cfg = ({
    POSITIVE_SHIFT: { bg: 'rgba(94,158,126,.1)', border: 'rgba(94,158,126,.22)', icon: TrendingUp, color: 'var(--success)' },
    NEGATIVE_SHIFT: { bg: 'var(--accent-rose-dim)', border: 'rgba(201,112,112,.22)', icon: TrendingDown, color: 'var(--accent-rose)' },
    PLAYSTYLE_CHANGE: { bg: 'rgba(107,140,174,.1)', border: 'rgba(107,140,174,.22)', icon: AlertTriangle, color: 'var(--info)' },
    CONSISTENCY: { bg: 'var(--bg-elevated)', border: 'var(--border)', icon: Minus, color: 'var(--text-muted)' },
  } as any)[alert.type] ?? { bg: 'var(--bg-elevated)', border: 'var(--border)', icon: Minus, color: 'var(--text-muted)' };
  const Icon = cfg.icon;

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      className="p-3.5 rounded-lg flex items-start gap-3"
      style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={32} color={cfg.color} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <p style={{ fontSize: '21px', fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, color: 'var(--text-primary)' }}>{alert.message}</p>
          <span style={{
            fontSize: '16px', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, letterSpacing: '0.08em',
            padding: '1px 5px', borderRadius: '3px',
            background: alert.severity === 'HIGH' ? 'var(--accent-rose-dim)' : alert.severity === 'MEDIUM' ? 'var(--accent-terra-dim)' : 'var(--bg-elevated)',
            color: alert.severity === 'HIGH' ? 'var(--accent-rose)' : alert.severity === 'MEDIUM' ? 'var(--accent-terra)' : 'var(--text-muted)',
          }}>
            {alert.severity}
          </span>
        </div>
        <p style={{ fontSize: '21px', color: 'var(--text-secondary)' }}>{alert.context}</p>
      </div>
    </motion.div>
  );
};