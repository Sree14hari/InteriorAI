'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Design } from '@/types';
import { Check, Wand2, Heart, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DesignCardProps {
  design: Design;
  isSelected?: boolean;
  onSelect?: () => void;
  onCustomize?: () => void;
  onDelete?: () => void;
}

export function DesignCard({ design, isSelected, onSelect, onCustomize, onDelete }: DesignCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card
        className={`overflow-hidden cursor-pointer transition-all duration-300 bg-slate-900/50 border-white/10 backdrop-blur-sm hover:bg-slate-800/50 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 ${
          isSelected ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/25' : ''
        }`}
        onClick={onSelect}
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
          {/* Loading skeleton — shown while image is being generated */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 gap-3">
              <Loader2 className="w-8 h-8 text-purple-400/70 animate-spin" />
              <p className="text-gray-500 text-xs">Generating design…</p>
              <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {/* Error fallback */}
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/80 gap-2">
              <div className="text-2xl">🏠</div>
              <p className="text-gray-500 text-xs text-center px-4">
                {design.description}
              </p>
            </div>
          )}

          {/* Use plain <img> — avoids Next.js optimization issues with Pollinations URLs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.image}
            alt={design.description}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

          {/* Like button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-pink-500 text-pink-500 scale-110' : 'text-white'}`} />
          </button>

          {/* Selected badge */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}

          {/* Delete button — shown when onDelete provided */}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-red-500/70 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete design"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {design.description}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {design.preferences?.roomType && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs">
                {design.preferences.roomType}
              </span>
            )}
            {design.preferences?.styles?.[0] && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs">
                {design.preferences.styles[0]}
              </span>
            )}
          </div>

          {onCustomize && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 bg-white/5 border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 text-white transition-all text-xs"
              onClick={(e) => { e.stopPropagation(); onCustomize(); }}
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />
              Customize
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
