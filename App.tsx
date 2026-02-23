
// APP - Main application component with routing

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './src/components/Toast/ToastContext';
import { Sidebar } from './src/components/Layout/Sidebar';
import { SearchPage } from './src/pages/SearchPage';
import { ComparePage } from './src/pages/ComparePage';
import { TrendsPage } from './src/pages/TrendsPage';
import { ScoutingPage } from './src/pages/ScoutingPage';
import { MetaPage } from './src/pages/MetaPage';
import { Game } from './src/types/api';
import { Analytics } from '@vercel/analytics/react';

// TANSTACK QUERY CLIENT

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3600000, // 1 hour
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

// MAIN APP

function App() {
    const [currentGame, setCurrentGame] = useState<Game>(Game.VALORANT);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <BrowserRouter future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                    }}>
                        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
                            {/* Sidebar Navigation */}
                            <Sidebar
                                currentGame={currentGame}
                                onGameChange={setCurrentGame}
                            />

                            {/* Main Content */}
                            <Routes>
                                <Route
                                    path="/"
                                    element={<SearchPage currentGame={currentGame} />}
                                />
                                <Route
                                    path="/compare"
                                    element={<ComparePage currentGame={currentGame} />}
                                />
                                <Route
                                    path="/trends"
                                    element={<TrendsPage currentGame={currentGame} />}
                                />
                                <Route
                                    path="/scouting"
                                    element={<ScoutingPage currentGame={currentGame} />}
                                />
                                <Route
                                    path="/meta"
                                    element={<MetaPage currentGame={currentGame} />}
                                />
                            </Routes>
                        </div>
                    </BrowserRouter>
                </ToastProvider>
            </QueryClientProvider>
            <Analytics />
        </>
    );
}

export default App;