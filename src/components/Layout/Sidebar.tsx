// SIDEBAR NAVIGATION — Ember Console theme

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Search,
    TrendingUp,
    FileText,
    Users,
    Layers,
    Settings,
    Sun,
    Moon,
} from 'lucide-react';
import { Game } from '../../types/api';
import { useTheme } from '../../context/ThemeContext';

// TYPES

interface SidebarProps {
    currentGame: Game;
    onGameChange: (game: Game) => void;
}

interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

// NAV ITEMS

const navItems: NavItem[] = [
    { name: 'Search',   path: '/',        icon: Search },
    { name: 'Compare',  path: '/compare', icon: Users },
    { name: 'Trends',   path: '/trends',  icon: TrendingUp },
    { name: 'Scouting', path: '/scouting',icon: FileText },
    { name: 'Meta',     path: '/meta',    icon: Layers },
];

// GAME SELECTOR

const GameSelector: React.FC<{
    currentGame: Game;
    onGameChange: (game: Game) => void;
}> = ({ currentGame, onGameChange }) => {
    return (
        <div className="game-selector-track rounded-lg p-1 flex gap-1">
            {/* Valorant */}
            <button
                onClick={() => onGameChange(Game.VALORANT)}
                aria-label="Switch to Valorant"
                className="relative flex-1 px-3 py-2 rounded-md overflow-hidden transition-all duration-300"
                style={{
                    color: currentGame === Game.VALORANT
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}
            >
                {currentGame === Game.VALORANT && (
                    <motion.div
                        layoutId="game-pill"
                        className="absolute inset-0 rounded-md"
                        style={{ background: 'linear-gradient(135deg, var(--game-val) 0%, #a85858 100%)' }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                )}
                <span className="relative z-10">Valorant</span>
            </button>

            {/* League of Legends */}
            <button
                onClick={() => onGameChange(Game.LOL)}
                aria-label="Switch to League of Legends"
                className="relative flex-1 px-3 py-2 rounded-md overflow-hidden transition-all duration-300"
                style={{
                    color: currentGame === Game.LOL
                        ? 'var(--text-inverse)'
                        : 'var(--text-muted)',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                }}
            >
                {currentGame === Game.LOL && (
                    <motion.div
                        layoutId="game-pill"
                        className="absolute inset-0 rounded-md"
                        style={{ background: 'linear-gradient(135deg, var(--game-lol) 0%, #b87a60 100%)' }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                )}
                <span className="relative z-10">LoL</span>
            </button>
        </div>
    );
};

// THEME TOGGLE

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
            style={{
                color: 'var(--text-secondary)',
            }}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            <div className="flex items-center gap-2 flex-1">
                {isLight ? (
                    <Sun size={16} style={{ color: 'var(--accent-terra)' }} strokeWidth={2} />
                ) : (
                    <Moon size={16} style={{ color: 'var(--text-secondary)' }} strokeWidth={2} />
                )}
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: '13px', letterSpacing: '0.04em' }}>
                    {isLight ? 'Light Mode' : 'Dark Mode'}
                </span>
            </div>

            {/* Toggle pill */}
            <div
                className="relative shrink-0"
                style={{
                    width: '34px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: isLight ? 'var(--accent-terra-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${isLight ? 'var(--accent-terra)' : 'var(--border)'}`,
                    transition: 'all 0.25s ease',
                }}
            >
                <motion.div
                    animate={{ x: isLight ? 14 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: isLight ? 'var(--accent-terra)' : 'var(--text-muted)',
                    }}
                />
            </div>
        </button>
    );
};

// SIDEBAR

export const Sidebar: React.FC<SidebarProps> = ({ currentGame, onGameChange }) => {
    const location = useLocation();
    const isVal = currentGame === Game.VALORANT;
    const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
    const gameDim   = isVal ? 'var(--game-val-dim)' : 'var(--game-lol-dim)';

    return (
        <aside
            className="sidebar-texture w-64 h-screen flex flex-col shrink-0"
            style={{ borderRight: '1px solid var(--border)' }}
        >
            {/* Header */}
            <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                {/* Logo */}
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="logo-clip w-10 h-10 flex items-center justify-center shrink-0"
                        style={{
                            background: `linear-gradient(135deg, ${gameColor} 0%, ${isVal ? '#a85858' : '#b87a60'} 100%)`,
                            transition: 'background 0.4s ease',
                        }}
                    >
                        <Layers size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontSize: '22px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                        }}>
                            SCOUTER
                        </h1>
                        <p style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontSize: '9px',
                            fontWeight: 500,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                        }}>
                            Esports Intel
                        </p>
                    </div>
                </div>

                <GameSelector currentGame={currentGame} onGameChange={onGameChange} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 overflow-y-auto">
                <p style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    paddingLeft: '12px',
                    marginBottom: '10px',
                }}>
                    Navigation
                </p>

                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative"
                                    style={{
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        backgroundColor: isActive ? gameDim : 'transparent',
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
                                            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    {/* Active bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-bar"
                                            className="nav-active-bar"
                                            style={{ background: gameColor }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}

                                    <Icon
                                        size={17}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        style={{
                                            color: isActive ? gameColor : 'var(--text-secondary)',
                                            position: 'relative',
                                            zIndex: 1,
                                            transition: 'color 0.2s ease',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span style={{
                                        fontFamily: 'Rajdhani, sans-serif',
                                        fontSize: '14px',
                                        fontWeight: isActive ? 600 : 500,
                                        letterSpacing: '0.04em',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}>
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 pt-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
                <ThemeToggle />
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                    }}
                >
                    <Settings size={16} strokeWidth={2} />
                    <span style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                    }}>
                        Settings
                    </span>
                </button>
            </div>
        </aside>
    );
};