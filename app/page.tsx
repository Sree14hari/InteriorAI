'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  MessageSquare,
  Palette,
  ArrowRight,
  Wand2,
  ImageIcon,
  Zap,
  Star,
} from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Chat with AI',
    description: 'Describe your room and preferences naturally. Our AI understands your unique vision and style.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    icon: Sparkles,
    title: 'Generate Concepts',
    description: 'Get multiple AI-generated design variations, each tailored precisely to your taste.',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    icon: Palette,
    title: 'Customize & Refine',
    description: 'Fine-tune wall colors, furniture styles, lighting and flooring until it feels like home.',
    gradient: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
];

const STATS = [
  { value: 'Free', label: 'API access', icon: Zap },
  { value: 'Instant', label: 'generation', icon: Sparkles },
  { value: '∞', label: 'design variations', icon: Star },
];

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-[calc(100vh-4rem)]">
      {/* Animated ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-20 max-w-6xl">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-gray-400 font-medium">Powered by Pollinations AI · Free to use</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Living Space
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your dream room to our AI designer. Get photorealistic interior concepts generated instantly — completely free.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/design/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-6 text-base rounded-2xl shadow-xl shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-[1.03] group"
              >
                <Wand2 className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Designing Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-6 text-base rounded-2xl"
              >
                <ImageIcon className="mr-2 w-5 h-5" />
                View My Designs
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid md:grid-cols-3 gap-5 mb-20"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`h-full p-6 rounded-2xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 hover:shadow-xl ${feature.glow} relative overflow-hidden`}>
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-center border-t border-white/5 pt-16"
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-purple-400/60" />
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {value}
              </div>
              <div className="text-gray-600 text-sm capitalize">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-20 relative overflow-hidden rounded-3xl p-10 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-pink-900/40 border border-white/8 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to reimagine your space?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              No sign-up needed. Chat with AI, generate concepts, and customize your perfect room in minutes.
            </p>
            <Link href="/design/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-10 py-6 text-base rounded-2xl shadow-xl shadow-purple-500/30 hover:scale-[1.03] transition-all"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Get Started — It&apos;s Free
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
