
// SIDEBAR NAVIGATION - Game-specific theming with persistent navigation

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
} from 'lucide-react';
import { Game } from '../../types/api';

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

// NAVIGATION ITEMS

const navItems: NavItem[] = [
    { name: 'Search', path: '/', icon: Search },
    { name: 'Compare', path: '/compare', icon: Users },
    { name: 'Trends', path: '/trends', icon: TrendingUp },
    { name: 'Scouting', path: '/scouting', icon: FileText },
    { name: 'Meta', path: '/meta', icon: Layers },
];

// GAME SELECTOR

const GameSelector: React.FC<{
    currentGame: Game;
    onGameChange: (game: Game) => void;
}> = ({ currentGame, onGameChange }) => {
    return (
        <div className="relative">
            <div className="flex gap-2 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                {/* Valorant */}
                <button
                    onClick={() => onGameChange(Game.VALORANT)}
                    className={`
            flex-1 px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider
            transition-all duration-300 relative overflow-hidden
            ${currentGame === Game.VALORANT
                            ? 'text-white'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }
          `}
                    aria-label="Switch to Valorant"
                >
                    {currentGame === Game.VALORANT && (
                        <motion.div
                            layoutId="game-selector"
                            className="absolute inset-0 bg-linear-to-br from-red-600 to-red-700 rounded-md"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">Valorant</span>
                </button>

                {/* League of Legends */}
                <button
                    onClick={() => onGameChange(Game.LOL)}
                    className={`
            flex-1 px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-wider
            transition-all duration-300 relative overflow-hidden
            ${currentGame === Game.LOL
                            ? 'text-black'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }
          `}
                    aria-label="Switch to League of Legends"
                >
                    {currentGame === Game.LOL && (
                        <motion.div
                            layoutId="game-selector"
                            className="absolute inset-0 bg-linear-to-br from-amber-400 to-amber-500 rounded-md"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">League Of Legends</span>
                </button>
            </div>
        </div>
    );
};

// SIDEBAR COMPONENT

export const Sidebar: React.FC<SidebarProps> = ({
    currentGame,
    onGameChange,
}) => {
    const location = useLocation();

    const accentColor =
        currentGame === Game.VALORANT
            ? 'from-red-600 to-red-700'
            : 'from-amber-400 to-amber-500';

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800/50 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className={`w-10 h-10 rounded-lg bg-linear-to-br ${accentColor} flex items-center justify-center`}
                    >
                        <Layers size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">
                            Scouter
                        </h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                            Esports Intel
                        </p>
                    </div>
                </div>

                <GameSelector currentGame={currentGame} onGameChange={onGameChange} />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 relative
                    ${isActive
                                            ? 'text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                        }
                  `}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-indicator"
                                            className={`absolute inset-0 bg-linear-to-br ${accentColor} opacity-10 rounded-lg`}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    {/* Active border */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-border"
                                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-linear-to-b ${accentColor} rounded-r-full`}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <Icon
                                        size={18}
                                        strokeWidth={2.5}
                                        className={`relative z-10 ${isActive
                                            ? currentGame === Game.VALORANT
                                                ? 'text-red-500'
                                                : 'text-amber-500'
                                            : ''
                                            }`}
                                    />
                                    <span className="relative z-10 text-sm font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800/50">
                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-zinc-400 hover:text-white hover:bg-zinc-900/50
                     transition-all duration-200 text-sm"
                >
                    <Settings size={18} strokeWidth={2.5} />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </aside>
    );
};