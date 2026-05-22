"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, Briefcase, MapPin, Sparkles, X } from "lucide-react";

export function Hero() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SectionWrapper id="hero" className="pt-32 lg:pt-48 pb-16 overflow-visible">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center overflow-visible">
        
        {/* Left: Text Content */}
        <div className="flex flex-col gap-8 max-w-xl mx-auto lg:mx-0 w-full z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-white/10 w-fit"
          >
            <Sparkles size={14} className="text-[#0052FF]" />
            <span className="text-sm font-medium text-zinc-300">La nueva era del networking</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Conecta. Colabora. <span className="text-gradient">Crece.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg"
          >
            Haz swipe hacia tu próxima gran oportunidad profesional. Encuentra talento, proyectos y co-fundadores en una plataforma diseñada para el éxito.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-center flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Empieza ahora
            </Link>
            <Link
              href="#producto"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("producto")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 transition-colors text-center"
            >
              Ver demo
            </Link>
          </motion.div>
        </div>

        {/* Right: Floating Cards */}
        <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-end perspective-1000 overflow-visible z-0">
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0052FF]/30 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative w-full max-w-[340px] flex items-center justify-center overflow-visible">
            {/* Card 1 (Back Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20, rotate: -15 }}
              animate={{ opacity: 0.5, x: -80, y: 10, rotate: -8 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute glass-card w-[300px] rounded-3xl p-6 border border-white/5 shadow-2xl z-10"
            >
              <ProfileCard 
                name="Elena R." 
                role="UX/UI Designer" 
                company="Figma Enthusiast"
                image="bg-gradient-to-br from-pink-500 to-rose-500"
              />
            </motion.div>
            
            {/* Card 2 (Back Right) */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20, rotate: 15 }}
              animate={{ opacity: 0.5, x: 80, y: 10, rotate: 8 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute glass-card w-[300px] rounded-3xl p-6 border border-white/5 shadow-2xl z-10"
            >
              <ProfileCard 
                name="Carlos M." 
                role="Backend Eng" 
                company="Rust 🦀"
                image="bg-gradient-to-br from-emerald-400 to-teal-500"
              />
            </motion.div>
            
            {/* Card 3 (Center Main) */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative glass-card w-[320px] rounded-3xl p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 bg-[#18181b]/90 backdrop-blur-2xl"
            >
              <ProfileCard 
                name="Alex García" 
                role="Fullstack Developer" 
                company="Buscando co-founder"
                image="bg-gradient-to-br from-[#0052FF] to-[#8B5CF6]"
                isMain
              />
            </motion.div>

            {/* Notification */}
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -right-4 lg:-right-12 top-10 z-30 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">¡Nuevo Match!</p>
                  <p className="text-xs text-zinc-400">Alex quiere conectar</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function ProfileCard({ name, role, company, image, isMain = false }: { name: string, role: string, company: string, image: string, isMain?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`w-full ${isMain ? 'h-64' : 'h-48'} rounded-2xl ${image} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-xl truncate">{name}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1 mt-1 truncate">
            <Briefcase size={12} /> {role}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <MapPin size={14} />
          <span>Madrid, España</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'UI/UX'].map((skill, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-300 border border-white/5">
              {skill}
            </span>
          ))}
        </div>
        
        {isMain && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button className="py-3 rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors flex justify-center border border-white/5">
              <X size={20} />
            </button>
            <button className="py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex justify-center border border-green-500/20">
              <CheckCircle2 size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
