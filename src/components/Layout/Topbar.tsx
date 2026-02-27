// TOP BAR — Page title + game toggle + theme toggle

import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { Game } from '../../types/api';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
    title: string;
    currentGame: Game;
    onGameChange: (g: Game) => void;
}

// Game toggle pill
const GameToggle: React.FC<{ currentGame: Game; onGameChange: (g: Game) => void }> = ({
    currentGame, onGameChange,
}) => {
    return (
        <div
            className="flex items-center p-1 rounded-lg"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}
        >
            {[
                { game: Game.VALORANT, label: 'VAL', activeGrad: 'linear-gradient(135deg,#C97070 0%,#a85858 100%)', activeText: '#fff' },
                { game: Game.LOL, label: 'LoL', activeGrad: 'linear-gradient(135deg,#D4957A 0%,#b87a60 100%)', activeText: '#1a0e08' },
            ].map(({ game, label, activeGrad, activeText }) => {
                const active = currentGame === game;
                return (
                    <button
                        key={game}
                        onClick={() => onGameChange(game)}
                        className="relative px-5 py-2 rounded-md overflow-hidden transition-all duration-200"
                        style={{
                            fontFamily: 'Rajdhani, sans-serif',
                            fontSize: '17px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            color: active ? activeText : 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            minWidth: '60px',
                        }}
                        aria-label={`Switch to ${label}`}
                    >
                        {active && (
                            <motion.div
                                layoutId="game-bg"
                                className="absolute inset-0 rounded-md"
                                style={{ background: activeGrad }}
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                            />
                        )}
                        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                    </button>
                );
            })}
        </div>
    );
};

// Theme toggle icon button
const ThemeButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className="flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
                width: '40px', height: '40px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
        >
            {isLight
                ? <Sun size={24} strokeWidth={2} color="var(--accent-terra)" />
                : <Moon size={24} strokeWidth={2} />
            }
        </button>
    );
};

export const TopBar: React.FC<TopBarProps> = ({ title, currentGame, onGameChange }) => (
    <header
        className="flex items-center justify-between px-6 shrink-0"
        style={{
            height: '72px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-secondary)',
            backgroundImage: 'repeating-linear-gradient(-55deg,transparent,transparent 24px,rgba(212,149,122,0.015) 24px,rgba(212,149,122,0.015) 25px)',
            transition: 'background-color 0.3s ease',
        }}
    >
        <h1
            style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                textTransform: 'uppercase',
            }}
        >
            {title}
        </h1>

        <div className="flex items-center gap-3">
            <GameToggle currentGame={currentGame} onGameChange={onGameChange} />
            <ThemeButton />
        </div>
    </header>
);