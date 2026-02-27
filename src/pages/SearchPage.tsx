// SEARCH PAGE — Ember Console

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, Loader2, Hash } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { SearchResultSkeleton } from '../components/Shared/Skeletonloader';
import { useToast } from '../components/Toast/ToastContext';
import { api, queryKeys } from '../service/api';
import { Game, SearchResult } from '../types/api';
import { useDebounce } from '../hooks/useDebounce';

interface SearchPageProps { currentGame: Game; }

const POPULAR: Record<Game, string[]> = {
  [Game.VALORANT]: ['Sentinels', 'Cloud9', 'G2 Esports', 'LOUD', 'NRG'],
  [Game.LOL]:      ['T1', 'Gen.G', 'Fnatic', 'G2 Esports', 'Cloud9'],
};

export const SearchPage: React.FC<SearchPageProps> = ({ currentGame }) => {
  const [query, setQuery]         = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounced = useDebounce(query, 300);
  const inputRef  = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const isVal     = currentGame === Game.VALORANT;
  const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';
  const gameDim   = isVal ? 'var(--game-val-dim)' : 'var(--game-lol-dim)';

  useEffect(() => { inputRef.current?.focus(); }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.search({ query: debounced, game: currentGame }),
    queryFn:  () => api.search({ query: debounced, game: currentGame }),
    enabled:  debounced.length >= 2,
    staleTime: 3_600_000,
  });

  useEffect(() => {
    if (error) showToast('error', 'Search failed', (error as Error).message);
  }, [error, showToast]);

  const hasResults = (data?.results?.length ?? 0) > 0;

  return (
    <PageWrapper description="Find and analyze esports teams">
      {/* ── Search bar ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: `1px solid ${isFocused ? gameColor + '80' : 'var(--border)'}`,
            boxShadow: isFocused ? `0 0 0 3px ${gameDim}, 0 4px 20px rgba(0,0,0,0.2)` : '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <SearchIcon
            size={28}
            style={{ color: isFocused ? gameColor : 'var(--text-muted)', flexShrink: 0, transition: 'color 0.2s' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            placeholder="Search teams…"
            aria-label="Search teams"
            style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:'23px', color:'var(--text-primary)' }}
            className="placeholder:text-(--text-muted)"
          />
          {isLoading && <Loader2 size={22} style={{ color:'var(--text-muted)', flexShrink:0 }} className="animate-spin" />}
        </div>
      </div>

      {/* ── Results area ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {debounced.length >= 2 ? (
            <motion.div
              key="results"
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.24 }}
            >
              {isLoading ? (
                <div className="space-y-2">
                  {[1,2,3,4].map(i => <SearchResultSkeleton key={i} />)}
                </div>
              ) : hasResults ? (
                <>
                  <p style={{ fontSize:'18px', color:'var(--text-muted)', marginBottom:'10px' }}>
                    <span style={{ color:'var(--text-secondary)', fontWeight:600 }}>{data?.count}</span> result{(data?.count ?? 0) !== 1 ? 's' : ''} for &ldquo;{data?.query}&rdquo;
                  </p>
                  <div className="space-y-1.5">
                    {(data?.results ?? []).map((r: SearchResult, i: number) => (
                      <ResultRow key={`${r.name}-${i}`} result={r} index={i} gameColor={gameColor} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState query={debounced} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="popular"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
            >
              <p style={{ fontSize:'17px', fontFamily:'Rajdhani,sans-serif', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'10px' }}>
                Popular
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR[currentGame].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150"
                    style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', fontSize:'18px', color:'var(--text-secondary)', cursor:'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border-hover)'; (e.currentTarget as HTMLElement).style.color='var(--text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLElement).style.color='var(--text-secondary)'; }}
                  >
                    <Hash size={20} style={{ color:'var(--text-muted)' }} />
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

// ── Result row ──────────────────────────────────────────────────────────────
const ResultRow: React.FC<{ result: SearchResult; index: number; gameColor: string }> = ({
  result, index, gameColor,
}) => (
  <motion.div
    initial={{ opacity:0, x:-12 }}
    animate={{ opacity:1, x:0 }}
    transition={{ delay: index * 0.03 }}
    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-150"
    style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', cursor:'pointer' }}
    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='var(--border-hover)'; el.style.backgroundColor='var(--bg-elevated)'; }}
    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='var(--border)'; el.style.backgroundColor='var(--bg-card)'; }}
  >
    {/* Avatar */}
    <div
      className="logo-clip flex items-center justify-center shrink-0"
      style={{ width:36, height:36, background:`linear-gradient(135deg,${gameColor} 0%,${gameColor}99 100%)` }}
    >
      <span style={{ fontFamily:'Rajdhani,sans-serif', fontWeight:700, fontSize:'23px', color:'#fff' }}>
        {result.name.charAt(0)}
      </span>
    </div>

    {/* Info */}
    <div style={{ flex:1, minWidth:0 }}>
      <p style={{ fontFamily:'Rajdhani,sans-serif', fontSize:'23px', fontWeight:600, color:'var(--text-primary)', lineHeight:1.2 }}>
        {result.displayName}
      </p>
      <p style={{ fontSize:'17px', color:'var(--text-muted)', marginTop:'2px' }}>
        {result.title} · {result.relevance}% match
      </p>
    </div>

    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
      <path d="M5 3l6 5-6 5" />
    </svg>
  </motion.div>
);

const EmptyState: React.FC<{ query: string }> = ({ query }) => (
  <div style={{ textAlign:'center', padding:'40px 0' }}>
    <p style={{ fontSize:'18px', color:'var(--text-secondary)', marginBottom:'4px' }}>No results for &ldquo;{query}&rdquo;</p>
    <p style={{ fontSize:'18px', color:'var(--text-muted)' }}>Try a different search term</p>
  </div>
);