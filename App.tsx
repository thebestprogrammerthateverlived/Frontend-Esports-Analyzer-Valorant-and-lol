// APP — Command Rail layout: NavRail (64px) + TopBar (52px) + scrollable content

import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './src/components/Toast/ToastContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { NavRail } from './src/components/Layout/NavRail';
import { TopBar } from './src/components/Layout/TopBar';
import { PageSkeleton } from './src/components/Shared/Skeletonloader';
import { Game } from './src/types/api';
import { Analytics } from '@vercel/analytics/react';

// ── Lazy-load every page so each route becomes its own JS chunk ──────────────
const SearchPage = lazy(() => import('./src/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ComparePage = lazy(() => import('./src/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const TrendsPage = lazy(() => import('./src/pages/TrendsPage').then(m => ({ default: m.TrendsPage })));
const ScoutingPage = lazy(() => import('./src/pages/ScoutingPage').then(m => ({ default: m.ScoutingPage })));
const MetaPage = lazy(() => import('./src/pages/MetaPage').then(m => ({ default: m.MetaPage })));

// ── Route metadata ────────────────────────────────────────────────────────────
export const ROUTE_META: Record<string, { title: string; description: string }> = {
    '/': { title: 'Search', description: 'Find teams across Valorant and League of Legends' },
    '/compare': { title: 'Compare', description: 'Head-to-head team analysis' },
    '/trends': { title: 'Trends', description: 'Performance over time' },
    '/scouting': { title: 'Scouting Report', description: 'Pre-match breakdown' },
    '/meta': { title: 'Meta', description: 'Coming soon' },
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 3_600_000, refetchOnWindowFocus: false, retry: 1 },
    },
});

// Shell needs router context (useLocation), so it lives inside BrowserRouter
function Shell({ currentGame, setCurrentGame }: {
    currentGame: Game;
    setCurrentGame: (g: Game) => void;
}) {
    const location = useLocation();
    const meta = ROUTE_META[location.pathname] ?? ROUTE_META['/'];

    return (
        <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* 64 px icon rail */}
            <NavRail currentGame={currentGame} />

            {/* Right column */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar title={meta.title} currentGame={currentGame} onGameChange={setCurrentGame} />

                <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <Suspense fallback={<PageSkeleton />}>
                        <Routes>
                            <Route path="/" element={<SearchPage currentGame={currentGame} />} />
                            <Route path="/compare" element={<ComparePage currentGame={currentGame} />} />
                            <Route path="/trends" element={<TrendsPage currentGame={currentGame} />} />
                            <Route path="/scouting" element={<ScoutingPage currentGame={currentGame} />} />
                            <Route path="/meta" element={<MetaPage currentGame={currentGame} />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </div>
    );
}

function App() {
    const [currentGame, setCurrentGame] = useState<Game>(Game.VALORANT);
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <ToastProvider>
                        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <Shell currentGame={currentGame} setCurrentGame={setCurrentGame} />
                        </BrowserRouter>
                    </ToastProvider>
                </ThemeProvider>
            </QueryClientProvider>
            <Analytics />
        </>
    );
}

export default App;