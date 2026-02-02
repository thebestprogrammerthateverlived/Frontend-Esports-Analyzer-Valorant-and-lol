// ============================================================================
// TEAM SELECTOR - Dropdown for selecting teams
// ============================================================================

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    label,
    selectedTeam,
    onChange,
    game,
    accentColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch teams list
    const { data: teamsData, isLoading } = useQuery({
        queryKey: queryKeys.teams(game),
        queryFn: () => api.getTeams(game),
        staleTime: 3600000, // 1 hour
    });

    // Filter teams based on search
    const filteredTeams = teamsData?.teams?.filter((team) =>
        team.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const borderColor = isOpen 
        ? (accentColor === 'red' ? 'border-red-600' : 'border-amber-600')
        : 'border-zinc-800/50 hover:border-zinc-700';

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
                {label}
            </label>

            {/* Selector Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className={`w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border rounded-lg transition-all duration-200 ${borderColor} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span className={selectedTeam ? 'text-white' : 'text-zinc-500'}>
                    {selectedTeam || (isLoading ? 'Loading teams...' : 'Select a team...')}
                </span>
                <ChevronDown
                    size={18}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown content */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 z-50
                       bg-zinc-900 border border-zinc-800 rounded-lg
                       shadow-2xl shadow-black/50 overflow-hidden"
                        >
                            {/* Search */}
                            <div className="p-3 border-b border-zinc-800">
                                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-950 rounded-lg">
                                    <Search size={16} className="text-zinc-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search teams..."
                                        className="flex-1 bg-transparent text-white text-sm outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Team List */}
                            <div className="max-h-64 overflow-y-auto">
                                {filteredTeams.length > 0 ? (
                                    filteredTeams.map((team, index) => {
                                        const isSelected = team === selectedTeam;
                                        const selectedBg = accentColor === 'red' 
                                            ? 'bg-red-950/30 text-white'
                                            : 'bg-amber-950/30 text-white';
                                        
                                        return (
                                            <button
                                                key={`${team}-${index}`}
                                                onClick={() => {
                                                    onChange(team);
                                                    setIsOpen(false);
                                                    setSearchQuery('');
                                                }}
                                                className={`w-full px-4 py-3 text-left transition-colors ${
                                                    isSelected ? selectedBg : 'text-zinc-300 hover:bg-zinc-800'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">{team}</p>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                                        {isLoading ? 'Loading...' : 'No teams found'}
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