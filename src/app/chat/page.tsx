"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { Loader2, MessageSquare, Send, ArrowLeft, Briefcase, Sparkles } from "lucide-react";

interface Match {
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

interface Message {
  _id?: string;
  match_id: string;
  from_email: string;
  content: string;
  created_at: string;
  read: boolean;
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

function ChatContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMatchId = searchParams.get("match_id");

  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Cargar matches al iniciar
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          const loadedMatches = data.matches || [];
          setMatches(loadedMatches);
          
          if (initialMatchId) {
            const matchToSelect = loadedMatches.find((m: Match) => m.id === initialMatchId);
            if (matchToSelect) {
              setSelectedMatch(matchToSelect);
              shouldScrollRef.current = true;
            }
          }
        }
      } catch (err) {
        console.error("Error al obtener matches:", err);
      } finally {
        setLoadingMatches(false);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user, initialMatchId]);

  // Obtener mensajes de fondo para el snippet lateral de cada conversación
  useEffect(() => {
    if (matches.length > 0) {
      matches.forEach(async (m) => {
        try {
          const res = await fetch(`/api/messages?match_id=${m.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
              const last = data.messages[data.messages.length - 1];
              setLastMessages(prev => ({
                ...prev,
                [m.id]: last.content
              }));
            }
          }
        } catch (err) {
          console.error(`Error al cargar snippet del match ${m.id}:`, err);
        }
      });
    }
  }, [matches]);

  // Polling para el match seleccionado
  useEffect(() => {
    if (!selectedMatch) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?match_id=${selectedMatch.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Error al obtener mensajes en el polling:", err);
      }
    };

    // Primera carga inmediata al seleccionar
    fetchMessages();

    // Iniciar el polling cada 3 segundos
    const intervalId = setInterval(fetchMessages, 3000);

    // Limpieza estricta de intervalo al cambiar de match o al desmontar
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedMatch]);

  // Auto-scroll al fondo solo cuando se requiera (nueva conversación o mensaje enviado)
  useEffect(() => {
    if (shouldScrollRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      shouldScrollRef.current = false;
    }
  }, [messages]);

  // Actualizar snippet localmente al actualizar el historial de mensajes activos
  useEffect(() => {
    if (selectedMatch && messages.length > 0) {
      const last = messages[messages.length - 1];
      setLastMessages(prev => ({
        ...prev,
        [selectedMatch.id]: last.content
      }));
    }
  }, [messages, selectedMatch]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim() || sending) return;

    const content = newMessage.trim();
    shouldScrollRef.current = true;
    
    // Añadir mensaje de manera optimista
    const optimisticMsg: Message = {
      match_id: selectedMatch.id,
      from_email: user?.email || "",
      content,
      created_at: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: selectedMatch.id, content })
      });

      if (!res.ok) {
        console.error("Error al enviar mensaje");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          <p className="text-zinc-400 text-sm font-medium">Cargando tus mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative bg-[#050505] h-screen overflow-hidden flex flex-col">
        <div className="flex-1 pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col overflow-hidden w-full">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#0052FF]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="w-full mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-[#0052FF]" size={36} />
            Chat
          </h1>
        </div>

        {/* 2-Column Chat Layout */}
        <div className="flex-1 glass-card border border-white/10 rounded-3xl bg-[#09090b]/80 backdrop-blur-2xl flex overflow-hidden shadow-2xl min-h-0">
          
          {/* Left Column: List of conversations */}
          <div className={`w-full lg:w-1/3 border-r border-white/10 flex flex-col bg-white/[0.01] ${selectedMatch ? "hidden lg:flex" : "flex"}`}>
            <div className="p-6 border-b border-white/5 shrink-0">
              <h2 className="text-lg font-bold text-white">Mensajes</h2>
              <p className="text-sm text-zinc-500 mt-1">Tus conexiones activas</p>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-hide">
              {loadingMatches ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="animate-spin text-[#0052FF]" size={28} />
                </div>
              ) : matches.length > 0 ? (
                matches.map((m) => {
                  const isSelected = selectedMatch?.id === m.id;
                  const snippet = lastMessages[m.id] || "Sin mensajes aún";

                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        shouldScrollRef.current = true;
                        setSelectedMatch(m);
                      }}
                      className={`w-full p-4 flex gap-4 items-center text-left hover:bg-white/[0.03] transition-all cursor-pointer ${isSelected ? "bg-white/[0.04]" : ""}`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(m.name)} flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow shrink-0 overflow-hidden`}>
                        {m.profile_picture ? (
                          <img src={m.profile_picture} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          m.name[0]
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 truncate">{snippet}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 mb-4">
                    <MessageSquare size={24} className="opacity-50" />
                  </div>
                  <p className="text-zinc-400 font-medium">No tienes conexiones activas</p>
                  <p className="text-zinc-500 text-xs mt-2">
                    Haz match con otros profesionales en el dashboard para conversar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active conversation */}
          {selectedMatch ? (
            <div className={`flex-1 flex flex-col bg-white/[0.02] ${selectedMatch ? "flex" : "hidden lg:flex"}`}>
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#09090b]/40">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(selectedMatch.name)} flex items-center justify-center text-white font-bold text-md border border-white/10 shrink-0 overflow-hidden`}>
                    {selectedMatch.profile_picture ? (
                      <img src={selectedMatch.profile_picture} alt={selectedMatch.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedMatch.name[0]
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedMatch.name}</h3>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Briefcase size={10} className="text-[#0052FF]" />
                      <span>{selectedMatch.empresa_centro_estudios || "Freelance"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-black/10">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isOwn = msg.from_email === user.email;

                    return (
                      <div
                        key={index}
                        className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md leading-relaxed break-words ${
                            isOwn
                              ? "bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] text-white rounded-tr-none"
                              : "bg-white/5 text-zinc-200 border border-white/5 rounded-tl-none"
                          }`}
                        >
                          {msg.content}
                          <div className="text-[9px] text-white/40 mt-1 text-right select-none">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0052FF]/10 to-[#8B5CF6]/10 flex items-center justify-center border border-white/5 mb-4 animate-pulse">
                      <Sparkles size={18} className="text-[#8B5CF6]" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Comienzo de la conversación</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                      Envíale un mensaje a {selectedMatch.name.split(" ")[0]} para proponer una sinergia o agendar una llamada.
                    </p>
                  </div>
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#09090b]/40 shrink-0">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Escribe un mensaje a ${selectedMatch.name.split(" ")[0]}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0052FF]/40 focus:ring-1 focus:ring-[#0052FF]/40 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-3 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white/[0.02] text-center p-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0052FF]/10 to-[#8B5CF6]/10 flex items-center justify-center text-white border border-white/5 mb-6 shadow-inner">
                <MessageSquare size={32} className="text-[#0052FF] opacity-80" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Selecciona una conversación para empezar</h3>
              <p className="text-zinc-500 text-sm max-w-sm">
                Elige una de tus conexiones en el panel lateral izquierdo para ver el historial de chat y enviar propuestas.
              </p>
            </div>
          )}
          
        </div>
        </div>
      </main>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0052FF]" size={40} />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
