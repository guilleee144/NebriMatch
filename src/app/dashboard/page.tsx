"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Briefcase, MapPin, Loader2, MessageSquare, Sparkles, ArrowRight, RefreshCw, Send, Check, User } from "lucide-react";

interface NetworkProfile {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  skills: string[];
  bio: string;
  image: string; // Gradiente
}

const SAMPLE_PROFILES: NetworkProfile[] = [
  {
    id: 1,
    name: "Sofía Valenzuela",
    role: "AI Research Engineer",
    company: "Nebula Labs",
    location: "Madrid, España",
    skills: ["PyTorch", "NLP", "Transformers", "Python"],
    bio: "Investigando en modelos masivos de lenguaje aplicados a finanzas. Busco co-founders o ingenieros de datos para lanzar un agente inteligente SaaS de productividad corporativa.",
    image: "from-blue-600 via-indigo-600 to-violet-600"
  },
  {
    id: 2,
    name: "Mateo Silva",
    role: "Product Designer",
    company: "Stripe",
    location: "Barcelona (Remoto)",
    skills: ["Figma", "Design Systems", "Prototyping", "UX/UI"],
    bio: "Apasionado por simplificar la complejidad financiera. Quiero colaborar en proyectos open-source de diseño o guiar a estudiantes de último año para crear portfolios increíbles.",
    image: "from-pink-500 via-purple-500 to-indigo-500"
  },
  {
    id: 3,
    name: "Valeria Mendoza",
    role: "Lead Fullstack Dev",
    company: "Vercel",
    location: "Valencia, España",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    bio: "Optimizando la web un píxel a la vez. Busco desarrolladores de Solidity o Web3 para un proyecto experimental de networking descentralizado y recompensas en el campus.",
    image: "from-emerald-400 via-teal-500 to-blue-500"
  },
  {
    id: 4,
    name: "Javier Ortiz",
    role: "Founder & CEO",
    company: "Fintech Startup",
    location: "Sevilla, España",
    skills: ["Growth", "Fundraising", "Product Strategy", "B2B Sales"],
    bio: "Ex-consultor de McKinsey. Levantando ronda semilla de 1M€. Busco un CTO Fullstack con experiencia en Django/React para incorporarse como socio tecnológico inmediato.",
    image: "from-amber-400 via-orange-500 to-rose-500"
  }
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [matches, setMatches] = useState<NetworkProfile[]>([]);
  const [showMatchCelebration, setShowMatchCelebration] = useState<NetworkProfile | null>(null);
  const [activeChat, setActiveChat] = useState<NetworkProfile | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState<{ [key: number]: { sender: string; text: string; time: string }[] }>({
    1: [
      { sender: "them", text: "¡Hola! Qué bueno hacer match. Vi tu interés en el desarrollo de software.", time: "18:45" }
    ]
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          <p className="text-zinc-400 text-sm font-medium">Cargando tu panel profesional...</p>
        </div>
      </div>
    );
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    
    // Si es "Like" (derecha), simulamos un match inmediato para propósitos demostrativos interactivos
    if (direction === "right") {
      const currentProfile = SAMPLE_PROFILES[currentIndex];
      setTimeout(() => {
        setMatches((prev) => [currentProfile, ...prev]);
        setShowMatchCelebration(currentProfile);
      }, 350);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 400);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipeDirection(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeChat) return;

    const newMessage = {
      sender: "me",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    setChatMessage("");

    // Respuesta simulada inteligente tras 1.5s
    setTimeout(() => {
      const replyMessage = {
        sender: "them",
        text: `¡Excelente idea! Deberíamos agendar una videollamada corta esta semana. ¿Te viene bien el jueves por la tarde?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), replyMessage]
      }));
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen bg-[#050505] pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 overflow-visible">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0052FF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Left Column: Deck de Swipe */}
        <div className="flex-1 flex flex-col items-center justify-start min-h-[500px]">
          <div className="w-full max-w-md mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#0052FF] tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={12} className="animate-pulse" />
                Sugerencias de Hoy
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Conecta con Talento</h2>
            </div>
            
            {currentIndex >= SAMPLE_PROFILES.length && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all cursor-pointer"
              >
                <RefreshCw size={12} />
                Reiniciar
              </button>
            )}
          </div>

          {/* Card Swiper Container */}
          <div className="relative w-full max-w-md h-[460px] flex items-center justify-center overflow-visible">
            <AnimatePresence>
              {currentIndex < SAMPLE_PROFILES.length ? (
                (() => {
                  const profile = SAMPLE_PROFILES[currentIndex];
                  return (
                    <motion.div
                      key={profile.id}
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        y: 0,
                        x: swipeDirection === "left" ? -400 : swipeDirection === "right" ? 400 : 0,
                        rotate: swipeDirection === "left" ? -15 : swipeDirection === "right" ? 15 : 0,
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute w-full h-full glass-card border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#09090b]/90 backdrop-blur-3xl overflow-hidden"
                    >
                      {/* Top Accent line */}
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${profile.image}`} />

                      {/* Header Avatar and Basics */}
                      <div className="flex gap-4 items-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.image} flex items-center justify-center text-white font-bold text-2xl border border-white/10 shadow-lg`}>
                          {profile.name[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                            {profile.name}
                          </h3>
                          <p className="text-sm text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Briefcase size={14} className="text-[#0052FF]" />
                            {profile.role} a <span className="font-semibold text-white">{profile.company}</span>
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="my-5 flex-1 flex flex-col justify-center">
                        <h4 className="text-xs font-semibold text-[#8B5CF6] tracking-wider uppercase mb-1.5">Biografía</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed italic bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                          "{profile.bio}"
                        </p>
                      </div>

                      {/* Skills & Info */}
                      <div>
                        <div className="flex items-center gap-1 text-zinc-400 text-xs mb-3">
                          <MapPin size={12} />
                          <span>{profile.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {profile.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Swipe CTAs */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <button 
                            onClick={() => handleSwipe("left")}
                            className="py-3 px-6 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold transition-all flex items-center justify-center gap-2 group cursor-pointer"
                          >
                            <X size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            Saltar
                          </button>
                          <button 
                            onClick={() => handleSwipe("right")}
                            className="py-3 px-6 rounded-2xl border border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 font-semibold transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          >
                            <CheckCircle2 size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            Conectar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full glass-card border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.01]"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0052FF]/20 to-[#8B5CF6]/20 flex items-center justify-center text-white border border-white/10 mb-6 shadow-[0_0_30px_rgba(0,82,255,0.2)]">
                    <Sparkles size={24} className="text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Todo al día por hoy!</h3>
                  <p className="text-sm text-zinc-400 max-w-xs mb-6">
                    Has revisado todos los perfiles de tu zona. Regresa mañana para descubrir nuevos talentos o reinicia las sugerencias de muestra.
                  </p>
                  <button
                    onClick={handleReset}
                    className="py-2.5 px-6 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
                  >
                    Volver a ver perfiles
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Panel Lateral de Matches y Chats */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          
          {/* Box de Matches */}
          <div className="glass-card border border-white/10 rounded-3xl p-6 bg-[#09090b]/80 backdrop-blur-2xl flex-1 min-h-[380px] flex flex-col">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-[#0052FF]" />
              Conexiones & Chats
            </h3>

            {matches.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-600 mb-4">
                  <User size={20} className="opacity-50" />
                </div>
                <p className="text-sm font-semibold text-zinc-400">Sin matches activos</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                  Desliza hacia la derecha (Conectar) en las sugerencias para crear conexiones instantáneas.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1">
                {matches.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setActiveChat(profile)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      activeChat?.id === profile.id
                        ? "border-[#0052FF]/30 bg-[#0052FF]/5 shadow-[0_0_15px_rgba(0,82,255,0.05)]"
                        : "border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${profile.image} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {profile.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{profile.name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.role}</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Profile Summary */}
          <div className="glass-card border border-white/10 rounded-3xl p-5 bg-[#09090b]/80 backdrop-blur-2xl flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs text-zinc-500">
              <span>Estado: <span className="text-[#0052FF] font-semibold">Busqueda activa</span></span>
              <span>ID: #{user.id?.substring(0, 6) || "N/A"}</span>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Celebración de MATCH (Style Tinder) */}
      <AnimatePresence>
        {showMatchCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-[#0052FF]/30 to-[#8B5CF6]/30 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-[#09090b]/95 p-8 text-center shadow-[0_0_50px_rgba(0,82,255,0.4)] overflow-hidden"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0052FF] to-[#8B5CF6]" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-[#0052FF]/20 animate-bounce">
                <Sparkles size={28} />
              </div>

              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">¡Es un Match!</h2>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-8">
                Tú y <span className="font-semibold text-white">{showMatchCelebration.name}</span> queréis conectar profesionalmente.
              </p>

              {/* Match Avatars graphic */}
              <div className="flex justify-center items-center gap-6 mb-8 relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-2xl border-4 border-[#09090b] shadow-[0_0_20px_rgba(0,82,255,0.4)] relative z-10">
                  {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#0052FF] font-semibold relative z-20 shadow-md">
                  <Check size={16} />
                </div>

                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${showMatchCelebration.image} flex items-center justify-center text-white font-bold text-2xl border-4 border-[#09090b] shadow-[0_0_20px_rgba(139,92,246,0.4)] relative z-10`}>
                  {showMatchCelebration.name[0]}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setActiveChat(showMatchCelebration);
                    setShowMatchCelebration(null);
                  }}
                  className="py-3 px-6 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  Enviar mensaje ahora
                </button>
                <button
                  onClick={() => setShowMatchCelebration(null)}
                  className="py-3 px-6 rounded-full glass border border-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Seguir buscando talentos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIALOG/POPUP: Ventana de Chat */}
      <AnimatePresence>
        {activeChat && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[480px] glass-card border border-white/10 rounded-3xl bg-[#09090b]/95 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeChat.image} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {activeChat.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{activeChat.name}</p>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1"></span>
                    Activo ahora
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="text-center">
                <span className="text-[10px] text-zinc-600 bg-white/[0.02] border border-white/5 py-1 px-3 rounded-full">
                  Hoy hecho match
                </span>
              </div>
              
              {(chats[activeChat.id] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[75%] ${msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "me"
                        ? "bg-[#0052FF] text-white rounded-tr-none shadow-[0_4px_15px_rgba(0,82,255,0.2)]"
                        : "bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Mensaje a ${activeChat.name.split(" ")[0]}...`}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#0052FF] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
