'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/designStore';
import { DesignCard } from '@/components/design/DesignCard';
import { Design } from '@/types';
import {
  Loader2,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Wand2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PUTER_MODEL = 'black-forest-labs/FLUX.1-schnell';

const STATUS_MESSAGES = [
  'Crafting your design brief…',
  'Painting the walls…',
  'Placing the furniture…',
  'Perfecting the lighting…',
  'Adding finishing touches…',
  'Almost ready…',
];

// Convert an HTMLImageElement src to a persistent data URL
async function imgToDataUrl(img: HTMLImageElement): Promise<string> {
  // If already a data URL, return as-is
  if (img.src.startsWith('data:')) return img.src;

  // For blob URLs, draw to canvas → data URL
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const onLoad = () => {
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.onload = onLoad;
      img.onerror = () => reject(new Error('Image load failed'));
    }
  });
}

interface PromptItem {
  id: string;
  prompt: string;
  description: string;
}

type CardState = 'pending' | 'generating' | 'done' | 'error';

interface GeneratedCard {
  promptItem: PromptItem;
  state: CardState;
  design?: Design;
  error?: string;
}

export default function GeneratePage() {
  const router = useRouter();
  const { preferences, addDesign, selectDesign } = useDesignStore();
  const [cards, setCards] = useState<GeneratedCard[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [puterReady, setPuterReady] = useState(false);

  // Wait for puter.js to load
  useEffect(() => {
    const check = () => {
      if (typeof window !== 'undefined' && typeof (window as unknown as Record<string, unknown>).puter !== 'undefined') {
        setPuterReady(true);
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }, []);

  // Cycle loading status messages
  useEffect(() => {
    if (!isBuilding) return;
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, [isBuilding]);

  const generateAll = useCallback(async () => {
    if (!puterReady) return;
    setIsBuilding(true);
    setCards([]);
    setSelectedId(null);
    setStatusIdx(0);

    try {
      // Step 1: Get prompts from server
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, variations: 3 }),
      });
      const data = await res.json();
      const prompts: PromptItem[] = data.prompts ?? [];

      // Initialise card states
      setCards(prompts.map((p) => ({ promptItem: p, state: 'pending' })));
      setIsBuilding(false);

      // Step 2: Generate images in parallel via puter.ai.txt2img()
      await Promise.allSettled(
        prompts.map(async (item, idx) => {
          // Stagger starts slightly
          await new Promise((r) => setTimeout(r, idx * 400));

          setCards((prev) =>
            prev.map((c) =>
              c.promptItem.id === item.id ? { ...c, state: 'generating' } : c
            )
          );

          try {
            const img = await (window as unknown as { puter: typeof puter }).puter.ai.txt2img(
              item.prompt,
              { model: PUTER_MODEL }
            );
            const dataUrl = await imgToDataUrl(img);

            const design: Design = {
              id: item.id,
              image: dataUrl,
              description: item.description,
              preferences: preferences as Design['preferences'],
              createdAt: new Date(),
            };

            addDesign(design);

            setCards((prev) =>
              prev.map((c) =>
                c.promptItem.id === item.id ? { ...c, state: 'done', design } : c
              )
            );
          } catch (err) {
            console.error('Puter image error:', err);
            setCards((prev) =>
              prev.map((c) =>
                c.promptItem.id === item.id
                  ? { ...c, state: 'error', error: 'Generation failed' }
                  : c
              )
            );
          }
        })
      );
    } catch (err) {
      console.error('Generate error:', err);
      setIsBuilding(false);
    }
  }, [preferences, addDesign, puterReady]);

  // Auto-start on mount
  useEffect(() => {
    if (puterReady) generateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puterReady]);

  const doneCount = cards.filter((c) => c.state === 'done').length;
  const allDone = cards.length > 0 && cards.every((c) => c.state === 'done' || c.state === 'error');
  const selectedDesign = cards.find((c) => c.promptItem.id === selectedId)?.design ?? null;

  const handleSelect = (card: GeneratedCard) => {
    if (!card.design) return;
    setSelectedId(card.promptItem.id);
    selectDesign(card.design);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-pink-600/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Powered by Puter.js · FLUX.1-schnell · Free &amp; Unlimited
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
            Your Design Concepts
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isBuilding
              ? 'Building your design brief…'
              : cards.length === 0
              ? 'Waiting for Puter.js…'
              : allDone
              ? `${doneCount} design${doneCount !== 1 ? 's' : ''} generated — pick your favourite`
              : `Generating ${doneCount} of ${cards.length}…`}
          </p>
        </motion.div>

        {/* Initial loading (building prompts + waiting for puter) */}
        {(isBuilding || (!puterReady && cards.length === 0)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 flex items-center justify-center">
                <Loader2 className="w-9 h-9 text-purple-400 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl animate-pulse" />
            </div>
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-gray-300 font-medium"
                >
                  {STATUS_MESSAGES[statusIdx]}
                </motion.p>
              </AnimatePresence>
              <p className="text-gray-600 text-sm mt-1">
                {!puterReady ? 'Loading Puter.js…' : 'This may take up to 30 seconds per image'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Design cards grid */}
        {cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            {cards.map((card) => (
              <motion.div
                key={card.promptItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {card.state === 'done' && card.design ? (
                  <DesignCard
                    design={card.design}
                    isSelected={selectedId === card.promptItem.id}
                    onSelect={() => handleSelect(card)}
                    onCustomize={() => {
                      handleSelect(card);
                      router.push('/design/customize');
                    }}
                  />
                ) : card.state === 'error' ? (
                  <div className="aspect-[4/3] rounded-2xl bg-red-950/30 border border-red-500/20 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <p className="text-red-400 text-sm font-medium">Generation failed</p>
                    <p className="text-gray-600 text-xs">{card.promptItem.description}</p>
                  </div>
                ) : (
                  /* Skeleton while generating */
                  <div className="aspect-[4/3] rounded-2xl bg-slate-900/60 border border-white/8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 animate-pulse" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-purple-400/60 animate-spin" />
                      <p className="text-gray-600 text-xs">
                        {card.state === 'pending' ? 'Queued…' : 'Generating…'}
                      </p>
                      <div className="w-28 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Actions bar */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                variant="outline"
                onClick={generateAll}
                className="border-white/15 bg-white/5 hover:bg-white/10 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>

              {selectedDesign ? (
                <Button
                  onClick={() => router.push('/design/customize')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25 px-6"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Customize Selected
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <p className="text-gray-600 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Click a design to select it
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
