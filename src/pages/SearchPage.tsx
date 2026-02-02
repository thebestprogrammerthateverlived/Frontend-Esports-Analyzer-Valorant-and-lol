// ============================================================================
// SEARCH PAGE - Autocomplete search

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Loader2, TrendingUp } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { SearchResultSkeleton } from '../components/Shared/Skeletonloader';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, SearchResult } from '../types/api';
import { useDebounce } from '../hooks/useDebounce';

interface SearchPageProps {
    currentGame: Game;
}

export const SearchPage: React.FC<SearchPageProps> = ({ currentGame }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    // Auto-focus on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Query search
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.search({ query: debouncedQuery, game: currentGame }),
        queryFn: () => api.search({ query: debouncedQuery, game: currentGame }),
        enabled: debouncedQuery.length >= 2,
        staleTime: 3600000,
    });

    // Handle errors
    useEffect(() => {
        if (error) {
            showToast('error', 'Search failed', (error as Error).message);
        }
    }, [error, showToast]);

    const accentColor = currentGame === Game.VALORANT ? 'red-600' : 'amber-500';
    const borderFocused = currentGame === Game.VALORANT ? 'border-red-600' : 'border-amber-500';
    const textFocused = currentGame === Game.VALORANT ? 'text-red-600' : 'text-amber-500';

    return (
        <PageWrapper
            title="Search Teams"
            description="Find and analyze esports teams across Valorant and League of Legends"
        >
            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <div
                        className={`
              relative flex items-center gap-3 px-4 py-4
              bg-zinc-900/50 border rounded-xl
              transition-all duration-300
              ${isFocused ? `${borderFocused} shadow-lg` : 'border-zinc-800/50'}
            `}
                    >
                        <SearchIcon
                            size={20}
                            className={`shrink-0 transition-colors ${isFocused ? textFocused : 'text-zinc-500'}`}
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder="Search for teams..."
                            className="flex-1 bg-transparent text-white placeholder-zinc-500 
                       text-lg outline-none"
                            aria-label="Search teams"
                        />
                        {isLoading && (
                            <Loader2 size={20} className="animate-spin text-zinc-500" />
                        )}
                    </div>

                    {/* Search hint */}
                    {!isFocused && query.length === 0 && (
                        <p className="mt-2 text-xs text-zinc-600 text-center">
                            Type at least 2 characters to search
                        </p>
                    )}
                </div>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
                {debouncedQuery.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <SearchResultSkeleton key={i} />
                                ))}
                            </div>
                        ) : data && data.results.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-sm text-zinc-500 mb-4">
                                    Found {data.count} result{data.count !== 1 ? 's' : ''} for "{data.query}"
                                </p>
                                {data.results.map((result, index) => (
                                    <SearchResultItem
                                        key={`${result.name}-${index}`}
                                        result={result}
                                        index={index}
                                        accentColor={accentColor}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800/50 mb-4">
                                    <SearchIcon size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    No results found for "{debouncedQuery}"
                                </p>
                                <p className="text-zinc-600 text-xs mt-1">
                                    Try a different search term
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Popular searches hint */}
            {query.length === 0 && (
                <div className="max-w-2xl mx-auto mt-16">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-zinc-600" />
                        <h3 className="text-sm font-medium text-zinc-500">Popular searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(currentGame === Game.VALORANT
                            ? ['Sentinels', 'Cloud9', 'G2 Esports', 'Team Liquid', 'Fnatic']
                            : ['T1', 'Gen.G', 'Fnatic', 'G2 Esports', 'Cloud9']
                        ).map((term) => (
                            <button
                                key={term}
                                onClick={() => setQuery(term)}
                                className="px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg
                         text-sm text-zinc-400 hover:text-white hover:border-zinc-700
                         transition-all duration-200"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

// SEARCH RESULT ITEM

const SearchResultItem: React.FC<{
    result: SearchResult;
    index: number;
    accentColor: string;
}> = ({ result, index, accentColor }) => {
    const gradientFrom = accentColor === 'red-600' ? 'from-red-600' : 'from-amber-500';
    const gradientTo = accentColor === 'red-600' ? 'to-red-700' : 'to-amber-600';
    const hoverText = accentColor === 'red-600' ? 'group-hover:text-red-600' : 'group-hover:text-amber-500';
    const hoverArrow = accentColor === 'red-600' ? 'group-hover:text-red-600' : 'group-hover:text-amber-500';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 
               bg-zinc-900/50 border border-zinc-800/50 rounded-lg
               hover:bg-zinc-900 hover:border-zinc-700
               transition-all duration-200 group"
        >
            {/* Team Logo Placeholder */}
            <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shrink-0`}>
                <span className="text-white font-bold text-lg">
                    {result.name.charAt(0)}
                </span>
            </div>

            {/* Team Info */}
            <div className="flex-1 min-w-0">
                <h3 className={`text-white font-semibold ${hoverText} transition-colors`}>
                    {result.displayName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 uppercase tracking-wide">
                        {result.title}
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-xs text-zinc-600">
                        Match: {result.relevance}%
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div className={`text-zinc-600 ${hoverArrow} transition-colors`}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M7 4l6 6-6 6" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </motion.div>
    );
};