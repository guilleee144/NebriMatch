"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Stats() {
  const stats = [
    { value: "+10K", label: "Conexiones Creadas" },
    { value: "+2K", label: "Proyectos Publicados" },
    { value: "+500", label: "Matches Diarios" },
    { value: "95%", label: "Satisfacción" },
  ];

  return (
    <SectionWrapper id="estadisticas" className="border-y border-white/5 bg-white/[0.01]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col gap-2"
          >
            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient">
              {stat.value}
            </span>
            <span className="text-sm sm:text-base font-medium text-zinc-400">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

export function CTA() {
  const { user } = useAuth();
  return (
    <SectionWrapper id="cta" className="relative overflow-hidden text-center">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-[#0052FF]/20 to-[#8B5CF6]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto glass-card p-10 sm:p-16 lg:p-20 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Tu próxima oportunidad empieza con un match.
        </h2>
        <p className="text-lg text-zinc-300 mb-10 max-w-2xl">
          Únete a miles de profesionales y estudiantes que ya están construyendo el futuro del trabajo. No te quedes atrás.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {user ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-[#0052FF] to-[#8B5CF6] text-white font-semibold rounded-full hover:scale-105 transition-transform text-center flex items-center justify-center shadow-[0_0_30px_rgba(0,82,255,0.3)]"
            >
              Ir a la aplicación
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-center flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Unirse ahora gratis
            </Link>
          )}
          <button
            className="px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 transition-colors text-center"
          >
            Descargar App
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
