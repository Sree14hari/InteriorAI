'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/designStore';
import { DesignCard } from '@/components/design/DesignCard';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Sparkles,
  Wand2,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';

export default function DashboardPage() {
  const { designs, selectDesign, removeDesign } = useDesignStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-purple-400 text-sm font-medium mb-2">Your Collection</p>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              My Designs
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {designs.length} {designs.length === 1 ? 'design' : 'designs'} saved
            </p>
          </div>

          <div className="flex items-center gap-3">
            {designs.length > 0 && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            )}
            <Link href="/design/chat">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/20"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Design
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Empty state */}
        {designs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-400/60" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-purple-500/10 blur-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">No designs yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
              Start a conversation with your AI designer. Describe your room, pick a style, and generate stunning design concepts instantly.
            </p>
            <Link href="/design/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-base rounded-xl shadow-xl shadow-purple-500/25"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Start Your First Design
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              className={
                viewMode === 'grid'
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'grid grid-cols-1 gap-4'
              }
            >
              {designs.map((design, i) => (
                <motion.div
                  key={`${design.id}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DesignCard
                    design={design}
                    onSelect={() => selectDesign(design)}
                    onCustomize={() => {
                      selectDesign(design);
                      window.location.href = '/design/customize';
                    }}
                    onDelete={() => removeDesign(design.id)}
                  />
                </motion.div>
              ))}

              {/* Add new card */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: designs.length * 0.05 }}
              >
                <Link href="/design/chat">
                  <div
                    className={`border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer group ${
                      viewMode === 'grid' ? 'aspect-[4/3]' : 'h-36'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center mb-3 transition-colors">
                      <Plus className="w-6 h-6 text-gray-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <span className="text-gray-600 group-hover:text-purple-400 text-sm font-medium transition-colors">
                      New Design
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
