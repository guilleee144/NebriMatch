import Link from "next/link";
import { SectionWrapper } from "./SectionWrapper";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505]">
      <SectionWrapper noPadding className="py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Logo & Info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">N</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">NebriMatch</span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              Conecta, colabora y crece. La red profesional diseñada para la nueva generación de talento.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Producto</h4>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Características</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Modo Proyecto</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Seguridad</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Descargar App</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Compañía</h4>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Sobre Nosotros</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Carreras</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Contacto</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacidad</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Términos de Servicio</Link>
            <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Cookies</Link>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} NebriMatch. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>
      </SectionWrapper>
    </footer>
  );
}
