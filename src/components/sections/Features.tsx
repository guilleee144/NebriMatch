"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { Layers, BrainCircuit, MessageSquare, FolderKanban, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Swipe Profesional",
    description: "Una experiencia fluida e intuitiva. Desliza para descubrir talento y proyectos relevantes en segundos.",
  },
  {
    icon: BrainCircuit,
    title: "Matching Inteligente",
    description: "Nuestro algoritmo aprende de tus interacciones para sugerirte las conexiones más valiosas.",
  },
  {
    icon: MessageSquare,
    title: "Chat en Tiempo Real",
    description: "Comunícate sin fricción. Una interfaz de mensajería moderna, rápida y directa.",
  },
  {
    icon: FolderKanban,
    title: "Modo Proyecto",
    description: "Publica tus ideas o únete a proyectos existentes. Encuentra el equipo perfecto para tu startup.",
  },
  {
    icon: ShieldCheck,
    title: "Perfiles Verificados",
    description: "Conecta con confianza. Verificamos la identidad y credenciales de nuestros usuarios.",
  },
  {
    icon: Zap,
    title: "Interacciones Rápidas",
    description: "Olvídate de los mensajes corporativos aburridos. Aquí el networking es dinámico y directo.",
  },
];

export function Features() {
  return (
    <SectionWrapper id="funcionalidades" className="bg-[#09090b]">
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Networking rediseñado para el siglo XXI
        </h2>
        <p className="text-zinc-400 text-lg">
          Herramientas poderosas con un diseño impecable para acelerar tu crecimiento profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0052FF]/5 to-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} className="text-zinc-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
