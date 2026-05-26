"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, Users, ArrowLeft, MessageSquare, Briefcase, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";

interface MatchProfile {
  id: string;
  name: string;
  email: string;
  description: string;
  ciudad: string;
  empresa_centro_estudios: string;
  edad: number | null;
  profile_picture: string;
  matched_at: string;
}

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

function MatchesContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        setError(null);
        const res = await fetch("/api/matches");
        if (!res.ok) {
          throw new Error("No se pudieron cargar tus conexiones.");
        }
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Ocurrió un error inesperado.");
      } finally {
        setLoadingMatches(false);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          <p className="text-zinc-400 text-sm font-medium">Cargando tus matches...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen bg-[#050505] pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center overflow-visible">
        {/* Background Glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#0052FF]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-6xl mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="text-[#0052FF]" size={36} />
            Tus Matches {matches.length > 0 && `(${matches.length})`}
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Las personas con las que has conectado profesionalmente.
          </p>
        </div>

        {loadingMatches ? (
          /* Elegant Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card border border-white/10 rounded-3xl p-6 bg-[#09090b]/80 backdrop-blur-2xl flex flex-col justify-between h-[230px] animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-white/5 rounded w-full my-3" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
                <div className="h-10 bg-white/5 rounded-2xl mt-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="w-full max-w-3xl glass-card border border-red-500/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-[#09090b]/80 backdrop-blur-2xl shadow-2xl min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 mb-6">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Error de conexión</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-6 text-sm">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-6 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
            >
              Reintentar
            </button>
          </div>
        ) : matches.length > 0 ? (
          /* Matches Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {matches.map((match) => {
              const slicedDesc = match.description.length > 80 
                ? match.description.slice(0, 80) + "..." 
                : match.description;

              return (
                <div 
                  key={match.email}
                  className="relative glass-card border border-white/10 rounded-3xl p-6 bg-[#09090b]/80 backdrop-blur-2xl flex flex-col justify-between shadow-xl hover:scale-[1.01] transition-all overflow-hidden h-[240px] group"
                >
                  {/* Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGradient(match.name)}`} />
                  
                  <div>
                    {/* Header: Avatar, Name, Job */}
                    <div className="flex gap-4 items-start">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(match.name)} flex items-center justify-center text-white font-bold text-xl border border-white/10 shadow shrink-0 overflow-hidden`}>
                        {match.profile_picture ? (
                          <img src={match.profile_picture} alt={match.name} className="w-full h-full object-cover" />
                        ) : (
                          match.name[0]
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-white flex items-center gap-1.5 truncate">
                          {match.name}{match.edad ? `, ${match.edad}` : ""}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                          <Briefcase size={12} className="text-[#0052FF] shrink-0" />
                          <span className="truncate">{match.empresa_centro_estudios || "Freelance / Autónomo"}</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{match.ciudad || "No especificada"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-zinc-400 mt-4 line-clamp-2 italic leading-relaxed">
                      {slicedDesc ? `"${slicedDesc}"` : "Sin descripción disponible."}
                    </p>
                  </div>

                  {/* Chat Action */}
                  <Link 
                    href={`/chat?match_id=${match.id}`}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:border-[#0052FF]/20 group-hover:bg-[#0052FF]/10 group-hover:text-[#0052FF]"
                  >
                    <MessageSquare size={14} />
                    Iniciar Chat
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full max-w-3xl glass-card border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-[#09090b]/80 backdrop-blur-2xl shadow-2xl min-h-[400px]">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0052FF]/10 to-[#8B5CF6]/10 flex items-center justify-center text-white border border-white/10 mb-8 shadow-[0_0_30px_rgba(0,82,255,0.1)]">
              <Users size={40} className="text-[#8B5CF6]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Aún no tienes matches</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
              Vuelve al dashboard y empieza a conectar con el mejor talento para encontrar sinergias.
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 py-3.5 px-8 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
            >
              <ArrowLeft size={18} />
              Ir al Dashboard
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF]" size={40} />
      </div>
    }>
      <MatchesContent />
    </Suspense>
  );
}
