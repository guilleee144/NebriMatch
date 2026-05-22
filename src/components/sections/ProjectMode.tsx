"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { Calendar, MapPin, Users } from "lucide-react";

export function ProjectMode() {
  return (
    <SectionWrapper id="proyectos" className="bg-[#09090b]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Pasa de la idea <br className="hidden sm:block" /> a la ejecución.
          </h2>
          <p className="text-lg text-zinc-400 max-w-md">
            No busques solo personas, busca talento para un propósito específico. Publica tu proyecto, define los roles que necesitas y deja que el talento adecuado aplique.
          </p>
          <ul className="space-y-4 mt-4">
            {[
              "Encuentra co-fundadores técnicos o de negocio.",
              "Construye equipos para hackathons o proyectos open source.",
              "Consigue tus primeros clientes como freelancer."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* Card representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">NM</span>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">Buscando Equipo</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">NebriMatch App</h3>
            <p className="text-zinc-400 mb-6 text-sm">Plataforma de networking para la nueva generación de profesionales. Buscamos devs y designers para MVP.</p>
            
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Users size={16} className="text-zinc-500" /> Roles: Frontend, UX/UI
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <MapPin size={16} className="text-zinc-500" /> Híbrido - Madrid
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Calendar size={16} className="text-zinc-500" /> Duración: 3 meses
              </div>
            </div>

            <button className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors">
              Aplicar al Proyecto
            </button>
          </motion.div>
          
          {/* Decoration */}
          <div className="absolute -bottom-6 -right-6 w-full h-full border border-white/5 rounded-3xl -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#0052FF]/20 blur-[100px] -z-20 rounded-full" />
        </div>
      </div>
    </SectionWrapper>
  );
}

export function TechStack() {
  const techs = ["Next.js", "React", "TailwindCSS", "Framer Motion", "Supabase"];
  return (
    <SectionWrapper id="tecnologia" className="text-center">
      <p className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-8">
        Construido con tecnología moderna
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-70">
        {techs.map((tech, i) => (
          <div key={i} className="text-xl sm:text-2xl font-bold text-zinc-400 hover:text-white transition-colors cursor-default">
            {tech}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
