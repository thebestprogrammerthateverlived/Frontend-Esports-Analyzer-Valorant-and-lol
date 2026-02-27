// META PAGE — Ember Console

import React from 'react';
import { motion } from 'motion/react';
import { Layers, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { Game } from '../types/api';

interface MetaPageProps { currentGame: Game; }

export const MetaPage: React.FC<MetaPageProps> = ({ currentGame }) => {
    const isVal = currentGame === Game.VALORANT;
    const gameColor = isVal ? 'var(--game-val)' : 'var(--game-lol)';

    const features = [
        { icon: TrendingUp, title: 'Agent / Champion Meta', desc: 'Pick rates, ban rates, and win correlation across regions' },
        { icon: Calendar, title: 'Patch Impact', desc: 'How game updates shift team strategies and performance' },
        { icon: Sparkles, title: 'Regional Comparison', desc: 'Playstyle divergence between NA, EU, KR, and beyond' },
    ];

    return (
        <PageWrapper description="Comprehensive meta-game insights — coming soon">
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-2xl p-10 mb-6 text-center"
                    style={{
                        background: isVal
                            ? 'linear-gradient(135deg,#3D1E1E 0%,#1a0808 100%)'
                            : 'linear-gradient(135deg,#3D2A1E 0%,#1a1008 100%)',
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', transform: 'translate(40%,-40%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', transform: 'translate(-40%,40%)' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0, -3, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-flex items-center justify-center mb-5"
                            style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '16px' }}
                        >
                            <Layers size={40} color={gameColor} strokeWidth={2} />
                        </motion.div>

                        <h2 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '36px', fontWeight: 700, letterSpacing: '0.08em', color: '#fff', marginBottom: '8px' }}>
                            COMING SOON
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '21px', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                            Powerful meta-game analysis tools to give you the competitive edge
                        </p>
                    </div>
                </motion.div>

                {/* Feature cards */}
                <div className="grid grid-cols-3 gap-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="p-5 rounded-xl transition-all duration-200"
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'default' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                        >
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg mb-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <f.icon size={30} color={gameColor} strokeWidth={2} />
                            </div>
                            <h4 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '21px', fontWeight: 600, letterSpacing: '0.03em', color: 'var(--text-primary)', marginBottom: '5px' }}>
                                {f.title}
                            </h4>
                            <p style={{ fontSize: '23px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};