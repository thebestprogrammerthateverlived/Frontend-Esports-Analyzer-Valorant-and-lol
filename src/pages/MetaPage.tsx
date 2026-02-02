// ============================================================================
// META ANALYSIS PAGE - Coming Soon

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { Game } from '../types/api';

interface MetaPageProps {
    currentGame: Game;
}

export const MetaPage: React.FC<MetaPageProps> = ({ currentGame }) => {
    const accentColor =
        currentGame === Game.VALORANT
            ? 'from-red-600 to-red-700'
            : 'from-amber-400 to-amber-500';

    const upcomingFeatures = [
        {
            icon: TrendingUp,
            title: 'Agent/Champion Meta Trends',
            description: 'Track the most picked and banned agents/champions across regions',
        },
        {
            icon: Calendar,
            title: 'Patch Impact Analysis',
            description: 'Analyze how game updates affect team performance and strategies',
        },
        {
            icon: Sparkles,
            title: 'Regional Meta Comparison',
            description: 'Compare playstyles and preferences across different regions',
        },
    ];

    return (
        <PageWrapper
            title="Meta Analysis"
            description="Comprehensive meta-game insights and trends"
        >
            <div className="max-w-4xl mx-auto">
                {/* Coming Soon Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
            relative overflow-hidden
            bg-linear-to-br ${accentColor}
            rounded-2xl p-8 mb-8 text-center
          `}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
                        >
                            <Layers size={40} className="text-white" strokeWidth={2.5} />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-3">
                            Coming Soon
                        </h2>
                        <p className="text-white/80 text-lg max-w-md mx-auto">
                            We're building powerful meta-game analysis tools to give you the competitive edge
                        </p>
                    </div>
                </motion.div>

                {/* Upcoming Features */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">
                        What's Coming
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-800 mb-4">
                                    <feature.icon size={24} className="text-zinc-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Signup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-center"
                >
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Get Notified
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                        Be the first to know when Meta Analysis launches
                    </p>
                    <div className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm outline-none focus:border-zinc-700 transition-colors"
                        />
                        <button
                            className={`
                px-6 py-2 rounded-lg font-medium text-sm
                bg-linear-to-r ${accentColor}
                text-white hover:opacity-90 transition-opacity
              `}
                        >
                            Notify Me
                        </button>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
};