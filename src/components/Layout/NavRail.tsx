// NAV RAIL — 64 px icon column with floating tooltips

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, TrendingUp, FileText, Users, Layers, Settings } from 'lucide-react';
import { Game } from '../../types/api';

interface NavRailProps {
    currentGame: Game;
}

const NAV = [
    { path: '/', icon: Search, label: 'Search' },
    { path: '/compare', icon: Users, label: 'Compare' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/scouting', icon: FileText, label: 'Scouting' },
    { path: '/meta', icon: Layers, label: 'Meta' },
];

// Single nav button with tooltip
const RailItem: React.FC<{
    path: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    gameColor: string;
    gameDim: string;
}> = ({ path, icon: Icon, label, isActive, gameColor, gameDim }) => (
    <div className="relative group">
        <Link
            to={path}
            className="flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
                width: '54px', height: '54px',
                backgroundColor: isActive ? gameDim : 'transparent',
                color: isActive ? gameColor : 'var(--text-muted)',
                position: 'relative',
            }}
            onMouseEnter={e => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                }
            }}
            onMouseLeave={e => {
                if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                }
            }}
            aria-label={label}
        >
            {/* Active bar */}
            {isActive && (
                <motion.div
                    layoutId="rail-dot"
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{ width: '3px', height: '24px', background: gameColor }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                />
            )}
            <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
        </Link>

        {/* Floating tooltip */}
        <div
            className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
            <div
                className="px-3 py-2 rounded-lg whitespace-nowrap"
                style={{
                    backgroundColor: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-hover)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '17px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    color: 'var(--text-primary)',
                }}
            >
                {label}
                <div
                    className="absolute right-full top-1/2 -translate-y-1/2"
                    style={{
                        borderWidth: '5px', borderStyle: 'solid',
                        borderColor: 'transparent', borderRightColor: 'var(--border-hover)',
                    }}
                />
            </div>
        </div>
    </div>
);

export const NavRail: React.FC<NavRailProps> = ({ currentGame }) => {
    const location = useLocation();
    const isVal = currentGame === Game.VALORANT;
    const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
    const gameDim = isVal ? 'var(--game-val-dim)' : 'var(--game-lol-dim)';

    return (
        <aside
            className="flex flex-col items-center py-5 shrink-0"
            style={{
                width: '84px',
                borderRight: '1px solid var(--border)',
                backgroundColor: 'var(--bg-secondary)',
                backgroundImage: 'repeating-linear-gradient(-55deg,transparent,transparent 24px,rgba(212,149,122,0.02) 24px,rgba(212,149,122,0.02) 25px)',
                transition: 'background-color 0.3s ease',
            }}
        >
            {/* Logo mark */}
            <div
                className="flex items-center justify-center mb-7 shrink-0"
                style={{
                    width: '42px', height: '42px',
                    background: `linear-gradient(135deg, ${gameColor} 0%, ${isVal ? '#a85858' : '#b87a60'} 100%)`,
                    clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))',
                    transition: 'background 0.4s ease',
                }}
                title="Scouter"
            >
                <Layers size={26} color="#fff" strokeWidth={2.5} />
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-2 flex-1">
                {NAV.map(item => (
                    <RailItem
                        key={item.path}
                        {...item}
                        isActive={location.pathname === item.path}
                        gameColor={gameColor}
                        gameDim={gameDim}
                    />
                ))}
            </nav>

            {/* Settings at bottom */}
            <div className="relative group mt-2">
                <button
                    className="flex items-center justify-center rounded-xl transition-all duration-200"
                    style={{ width: '54px', height: '54px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    }}
                    aria-label="Settings"
                >
                    <Settings size={28} strokeWidth={2} />
                </button>
                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="px-3 py-2 rounded-lg whitespace-nowrap" style={{ backgroundColor: 'var(--bg-card-solid)', border: '1px solid var(--border-hover)', fontFamily: 'Rajdhani, sans-serif', fontSize: '17px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
                        Settings
                        <div className="absolute right-full top-1/2 -translate-y-1/2" style={{ borderWidth: '5px', borderStyle: 'solid', borderColor: 'transparent', borderRightColor: 'var(--border-hover)' }} />
                    </div>
                </div>
            </div>
        </aside>
    );
};