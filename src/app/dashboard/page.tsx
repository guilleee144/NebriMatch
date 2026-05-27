"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Briefcase, MapPin, Loader2, Sparkles, Info, RefreshCw } from "lucide-react";

export interface MockProfile {
  name: string;
  email: string;
  description: string;
  empresa_centro_estudios: string;
  edad: number | null;
  ciudad: string;
  profile_picture: string;
}

const MOCK_PROFILES: MockProfile[] = [
  {
    name: "Sofía Valenzuela",
    email: "sofia@mock.com",
    description: "Investigando modelos masivos de lenguaje aplicados a finanzas. Busco co-founders o ingenieros de datos.",
    empresa_centro_estudios: "Nebula Labs",
    edad: 27,
    ciudad: "Madrid",
    profile_picture: "/img_profile/sofia.jpg"
  },
  {
    name: "Carlos Mendoza",
    email: "carlos@mock.com",
    description: "Full-stack developer especializado en React y Node.js. Busco proyectos de impacto social.",
    empresa_centro_estudios: "Freelance",
    edad: 24,
    ciudad: "Barcelona",
    profile_picture: "/img_profile/carlos.png"
  },
  {
    name: "Laura Jiménez",
    email: "laura@mock.com",
    description: "UX Designer con 5 años de experiencia. Apasionada por el diseño de productos digitales premium.",
    empresa_centro_estudios: "Universidad Complutense",
    edad: 23,
    ciudad: "Valencia",
    profile_picture: "/img_profile/laura.png"
  },
  {
    name: "Alejandro Torres",
    email: "alejandro@mock.com",
    description: "Data Scientist buscando equipo para lanzar una startup de healthtech.",
    empresa_centro_estudios: "Google",
    edad: 30,
    ciudad: "Sevilla",
    profile_picture: "/img_profile/alejandro.png"
  },
  {
    name: "Marina López",
    email: "marina@mock.com",
    description: "Emprendedora en serie. He lanzado 2 startups. Busco CTO técnico para mi próximo proyecto.",
    empresa_centro_estudios: "IE Business School",
    edad: 32,
    ciudad: "Madrid",
    profile_picture: "/img_profile/marina.png"
  }
];

const getGradient = (name: string) => {
  const gradients = [
    "from-blue-600 via-indigo-600 to-violet-600",
    "from-pink-500 via-purple-500 to-indigo-500",
    "from-emerald-400 via-teal-500 to-blue-500",
    "from-amber-400 via-orange-500 to-rose-500",
    "from-cyan-500 via-blue-500 to-purple-600"
  ];
  return gradients[name.length % gradients.length];
};

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<MockProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MockProfile | null>(null);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [cardHeight, setCardHeight] = useState(520);
  useEffect(() => {
    const updateHeight = () => {
      const h = Math.min(520, window.innerHeight - 280);
      setCardHeight(h);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);


  const fetchProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const res = await fetch("/api/users/discover");
      if (!res.ok) throw new Error("Error fetching profiles");
      const data = await res.json();
      if (data.profiles && data.profiles.length > 0) {
        setProfiles(data.profiles);
      } else {
        setProfiles(MOCK_PROFILES);
      }
    } catch (err) {
      console.error("Fallo al obtener perfiles reales, usando fallback mock:", err);
      setProfiles(MOCK_PROFILES);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  if (loading || !user || loadingProfiles) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          <p className="text-zinc-400 text-sm font-medium">Cargando tu panel profesional...</p>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentProfile) return;

    const action = direction === "right" ? "like" : "pass";
    let isMatch = false;

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_email: currentProfile.email, action })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.matched) {
          isMatch = true;
        }
      }
    } catch (err) {
      console.error("Error al registrar swipe:", err);
    }

    setSwipeDirection(direction);

    if (isMatch) {
      setShowMatchCelebration(true);
      setTimeout(() => {
        setShowMatchCelebration(false);
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 2000);
    } else {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 400);
    }
  };


  return (
    <>
      <Navbar />

      <main className="relative h-[calc(100vh-64px)] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0052FF]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Swipe Deck Container */}
        <div className="w-full max-w-[420px] flex flex-col items-center justify-center gap-8 h-full">
          {/* Header Texts */}
          <div className="w-full text-center">
            <span className="text-xs font-semibold text-[#0052FF] tracking-wider uppercase flex items-center justify-center gap-1.5 mb-1">
              <Sparkles size={12} className="animate-pulse" />
              Sugerencias de Hoy
            </span>
            <h2 className="text-2xl font-bold text-white">Conecta con Talento</h2>
          </div>
          {/* Card Area */}
          <div className="relative w-full max-w-[380px] flex items-center justify-center" style={{ height: cardHeight }}>
            {currentProfile ? (
              <motion.div
                key={currentProfile.email}
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
                className="absolute w-full h-full glass-card border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.4)] bg-[#09090b]/90 backdrop-blur-3xl"
              >
                {/* Background image or gradient with initial */}
                {currentProfile.profile_picture ? (
                  <img src={currentProfile.profile_picture} alt={currentProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getGradient(currentProfile.name)} relative`}>
                    <div className="absolute top-[35%] left-0 right-0 flex justify-center -translate-y-1/2 text-white/30 font-bold text-8xl">{currentProfile.name[0]}</div>
                  </div>
                )}

                {/* Info button (top right) */}
                <button
                  onClick={() => setSelectedProfile(currentProfile)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white flex items-center justify-center z-20 cursor-pointer pointer-events-auto transition-colors"
                  title="Ver Perfil Completo"
                >
                  <Info size={18} />
                </button>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-[45%] flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0">
                  <div className="text-white pb-[80px] pointer-events-auto">
                    <h2 className="text-2xl font-bold mb-1">
                      {currentProfile.name.split(" ")[0]}{currentProfile.edad ? `, ${currentProfile.edad}` : ""}
                    </h2>
                    <p className="flex items-center text-sm mb-1">
                      <Briefcase size={14} className="text-[#0052FF] mr-1" />
                      {currentProfile.empresa_centro_estudios}
                    </p>
                    <p className="flex items-center text-sm">
                      <MapPin size={14} className="text-[#0052FF] mr-1" />
                      {currentProfile.ciudad}
                    </p>
                  </div>
                </div>

                {/* Swipe Action Buttons */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-6 z-20 pointer-events-auto">
                  <button
                    onClick={() => handleSwipe("left")}
                    className="w-16 h-16 rounded-full border-2 border-red-500/80 bg-black/50 hover:bg-black/70 text-red-500 transition-all flex items-center justify-center hover:scale-110 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer backdrop-blur-md"
                  >
                    <X size={32} />
                  </button>
                  <button
                    onClick={() => handleSwipe("right")}
                    className="w-16 h-16 rounded-full border-2 border-green-500/80 bg-black/50 hover:bg-black/70 text-green-500 transition-all flex items-center justify-center hover:scale-110 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-pointer backdrop-blur-md"
                  >
                    <CheckCircle2 size={32} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-white w-full">
                <RefreshCw className="w-12 h-12 mb-4 text-zinc-400" />
                <h2 className="text-2xl font-bold mb-2">No hay más perfiles por hoy</h2>
                <p className="text-zinc-400 mb-6">Vuelve mañana para descubrir nuevas conexiones</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white text-black py-2.5 px-6 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
                >
                  Recargar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MATCH CELEBRATION OVERLAY */}
      <AnimatePresence>
        {showMatchCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white border-2 border-white/20 mb-6 shadow-[0_0_50px_rgba(0,82,255,0.5)]">
                <Sparkles size={48} className="text-white" />
              </div>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight mb-4 drop-shadow-md">
                ¡Es un Match! 🎉
              </h2>
              <p className="text-zinc-300 text-lg max-w-sm">
                Has conectado con <span className="font-semibold text-white">{currentProfile?.name}</span>. ¡Ya podéis hablar en la sección de Chat!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Perfil Completo */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card border border-white/10 rounded-[2rem] bg-[#09090b]/95 p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center mb-8 mt-4">
                <div className={`w-28 h-28 rounded-[2rem] bg-gradient-to-br ${getGradient(selectedProfile.name)} flex items-center justify-center text-white font-bold text-5xl mb-5 shadow-lg border-2 border-white/5 overflow-hidden`}>
                  {selectedProfile.profile_picture ? (
                    <img src={selectedProfile.profile_picture} alt={selectedProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedProfile.name[0]
                  )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{selectedProfile.name}{selectedProfile.edad ? `, ${selectedProfile.edad}` : ""}</h2>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedProfile.empresa_centro_estudios}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedProfile.ciudad}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-3">Sobre Mí</h3>
                  <p className="text-zinc-300 leading-relaxed p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    {selectedProfile.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF]" size={40} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
