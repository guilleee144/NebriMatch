"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { UserPlus, Search, ThumbsUp, MessageSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Crea tu perfil",
    description: "Destaca tus habilidades, experiencia y lo que buscas en tu próximo gran proyecto.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Explora oportunidades",
    description: "Navega a través de perfiles de talento, empresas y proyectos emocionantes.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: ThumbsUp,
    title: "Haz Match",
    description: "Desliza a la derecha en los perfiles que te interesen. Si el interés es mutuo, ¡es un Match!",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: MessageSquare,
    title: "Conecta y chatea",
    description: "Rompe el hielo al instante con nuestro chat integrado, sin formalismos innecesarios.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Rocket,
    title: "Colabora y crece",
    description: "Inicia proyectos, encuentra co-fundadores o consigue el trabajo de tus sueños.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export function Timeline() {
  return (
    <SectionWrapper id="como-funciona" className="relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
          ¿Cómo funciona NebriMatch?
        </h2>
        <p className="text-zinc-400 text-lg">
          Un proceso simple y fluido diseñado para conectar talento de forma rápida y efectiva.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Línea conectora */}
        <div className="absolute left-[28px] md:left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />

        <div className="space-y-12 sm:space-y-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-2xl glass-card border-white/10 z-10">
                  <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center`}>
                    <Icon size={20} className={step.color} />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 text-left"}`}>
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
