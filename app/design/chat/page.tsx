'use client';

import { motion } from 'framer-motion';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ImageUploader } from '@/components/design/ImageUploader';
import { useDesignStore } from '@/store/designStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export default function ChatPage() {
  const { roomImage, setRoomImage } = useDesignStore();

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Page title */}
          <div className="text-center mb-10">
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-4"
            >
              ✨ Powered by Pollinations AI
            </motion.p>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
              Design Your Space
            </h1>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              Chat with Studio AI to describe your room and preferences. It will generate stunning interior concepts tailored to you.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 items-start">
            {/* Room photo uploader sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-slate-900/50 border-white/8 backdrop-blur-xl overflow-hidden sticky top-20">
                <CardHeader className="border-b border-white/8 bg-gradient-to-r from-purple-900/20 to-pink-900/10 px-4 py-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-400" />
                    Room Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ImageUploader image={roomImage} onImageSelect={setRoomImage} />
                  <p className="text-xs text-gray-600 mt-3 text-center leading-relaxed">
                    Optional — upload your room for better context
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <ChatContainer />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
