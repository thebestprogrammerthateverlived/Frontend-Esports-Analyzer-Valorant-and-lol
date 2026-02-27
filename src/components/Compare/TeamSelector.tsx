// TEAM SELECTOR — Ember Console theme

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, queryKeys } from '../../service/api';
import { Game } from '../../types/api';

interface TeamSelectorProps {
    label: string;
    selectedTeam: string;
    onChange: (teamName: string) => void;
    game: Game | string;
    accentColor: string;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
    label, selectedTeam, onChange, game, accentColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const { data: teamsData, isLoading } = useQuery({
        queryKey: queryKeys.teams(game),
        queryFn: () => api.getTeams(game),
        staleTime: 3_600_000,
    });

    const teams = teamsData?.teams?.filter((t: string) =>
        t.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const gameColor = accentColor === 'red' ? 'var(--game-val)' : 'var(--game-lol)';
    const gameDim = accentColor === 'red' ? 'var(--game-val-dim)' : 'var(--game-lol-dim)';

    return (
        <div className="relative">
            <label style={{
                display: 'block',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '6px',
            }}>
                {label}
            </label>

            <button
                onClick={() => setIsOpen(v => !v)}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    border: `1px solid ${isOpen ? gameColor + '88' : 'var(--border)'}`,
                    boxShadow: isOpen ? `0 0 0 3px ${gameDim}` : 'none',
                    color: selectedTeam ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                }}
            >
                <span style={{ fontSize: '18px', fontWeight: selectedTeam ? 500 : 400 }}>
                    {selectedTeam || (isLoading ? 'Loading…' : 'Select a team…')}
                </span>
                <ChevronDown
                    size={24}
                    style={{
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="dropdown-theme absolute top-full left-0 right-0 mt-1.5 z-50 rounded-lg overflow-hidden"
                        >
                            {/* Search */}
                            <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-md" style={{ backgroundColor: 'var(--bg-input)' }}>
                                    <Search size={24} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search…"
                                        style={{
                                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                            fontSize: '18px', color: 'var(--text-primary)',
                                        }}
                                        className="placeholder:text-[color:var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                {teams.length > 0 ? (
                                    teams.map((team: string, i: number) => {
                                        const sel = team === selectedTeam;
                                        return (
                                            <button
                                                key={`${team}-${i}`}
                                                onClick={() => { onChange(team); setIsOpen(false); setSearch(''); }}
                                                className="w-full px-4 py-3 text-left dropdown-item"
                                                style={sel ? { backgroundColor: gameDim, color: 'var(--text-primary)' } : {}}
                                            >
                                                <span style={{ fontSize: '18px', fontWeight: sel ? 600 : 400 }}>{team}</span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: '18px', color: 'var(--text-muted)' }}>
                                        {isLoading ? 'Loading…' : 'No teams found'}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};