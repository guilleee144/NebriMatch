"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("https://nebri-match.vercel.app");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 sm:p-8"
          >
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Top gradient effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0052FF] to-[#8B5CF6]" />

              <div className="p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 mt-2">
                  <h3 className="text-2xl font-bold text-white mb-2">Instala NebriMatch</h3>
                  <p className="text-zinc-400">Escanea el QR con tu móvil para abrir la app</p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-black p-4 rounded-2xl shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/qr-nebrimatch.png"
                      alt="QR NebriMatch"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-zinc-400 mb-3">O abre directamente en tu navegador móvil</p>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-zinc-400" />
                          <span>Copiar enlace</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <ol className="text-sm text-zinc-300 space-y-3">
                      <li className="flex gap-3">
                        <span className="font-bold text-[#8B5CF6]">1.</span>
                        <span>Escanea el QR con la cámara de tu móvil</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-[#8B5CF6]">2.</span>
                        <span>Pulsa &quot;Añadir a pantalla de inicio&quot; en tu navegador</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-bold text-[#8B5CF6]">3.</span>
                        <span>¡Úsala como una app nativa!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
