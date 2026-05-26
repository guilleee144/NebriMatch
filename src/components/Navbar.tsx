"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">NebriMatch</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <div className="relative">
                <Link 
                  href="/chat" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/chat" ? "text-white border-b-2 border-[#0052FF]" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Chat
                </Link>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-3.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <Link 
                href="/matches" 
                className={`text-sm font-medium transition-colors ${
                  pathname === "/matches" ? "text-white border-b-2 border-[#0052FF]" : "text-zinc-400 hover:text-white"
                }`}
              >
                Matches
              </Link>
            </>
          ) : (
            <>
              <Link href="#producto" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Producto
              </Link>
              <Link href="#funcionalidades" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Funcionalidades
              </Link>
              <Link href="#comunidad" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Comunidad
              </Link>
            </>
          )}
        </nav>

        {/* Desktop CTA / User Menu */}
        <div className="hidden md:flex items-center gap-6 relative">
          {user ? (
            <div className="relative z-50">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white font-semibold text-sm border border-white/10 group-hover:border-white/30 transition-all shadow-[0_0_15px_rgba(0,82,255,0.3)] overflow-hidden">
                  {user.profile_picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 py-2 overflow-hidden bg-[#09090b]/95 backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="p-1.5 space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-[#0052FF]" />
                        Ir a la aplicación
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings size={16} className="text-[#8B5CF6]" />
                        Ajustes de perfil
                      </Link>
                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          await logout();
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-white text-black hover:bg-zinc-200 transition-colors py-1.5 px-4 rounded-full text-sm font-semibold"
              >
                Empieza ahora
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 text-zinc-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 z-40"
          >
            {user ? (
              <>
                <div className="relative inline-block">
                  <Link 
                    href="/chat" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`text-2xl font-medium transition-colors ${
                      pathname === "/chat" ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Chat
                  </Link>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-6 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <Link 
                  href="/matches" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`text-2xl font-medium transition-colors ${
                    pathname === "/matches" ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Matches
                </Link>
              </>
            ) : (
              <>
                <Link href="#producto" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
                  Producto
                </Link>
                <Link href="#funcionalidades" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
                  Funcionalidades
                </Link>
                <Link href="#comunidad" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
                  Comunidad
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex flex-col items-center gap-5 mt-4 w-full px-6 max-w-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-[0_0_20px_rgba(0,82,255,0.4)] overflow-hidden">
                    {user.profile_picture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-lg font-bold text-white">{user.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 px-6 rounded-full text-base font-semibold shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <LayoutDashboard size={18} />
                  Ir a la aplicación
                </Link>
                
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-white py-2.5 px-6 rounded-full text-base font-semibold transition-colors"
                >
                  <Settings size={18} className="text-[#8B5CF6]" />
                  Ajustes de perfil
                </Link>
                
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2.5 px-6 rounded-full text-base font-semibold transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white mt-4">
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white text-black py-3 px-8 rounded-full text-lg font-semibold mt-4"
                >
                  Empieza ahora
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
