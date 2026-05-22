"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link href="#producto" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Producto
          </Link>
          <Link href="#funcionalidades" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Funcionalidades
          </Link>
          <Link href="#comunidad" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Comunidad
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-white text-black hover:bg-zinc-200 transition-colors py-1.5 px-4 rounded-full text-sm font-semibold"
          >
            Empieza ahora
          </Link>
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
            className="absolute top-0 left-0 w-full h-screen bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 z-40"
          >
            <Link href="#producto" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
              Producto
            </Link>
            <Link href="#funcionalidades" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
              Funcionalidades
            </Link>
            <Link href="#comunidad" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-zinc-300 hover:text-white">
              Comunidad
            </Link>
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
          </motion.div>
        )}
      </div>
    </header>
  );
}
