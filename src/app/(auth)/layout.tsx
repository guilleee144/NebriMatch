import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-[#050505]">
      {/* Left Column: Form Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[480px] xl:w-[560px] relative z-10">
        
        {/* Mobile-only background effects to ensure form readability if needed, though background is dark */}
        <div className="absolute top-0 left-0 w-full h-full lg:hidden overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#0052FF]/10 rounded-full blur-[100px]" />
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-[360px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">NebriMatch</span>
          </Link>

          {/* Children will be the actual forms */}
          {children}
        </div>
      </div>

      {/* Right Column: Branding / Graphics (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#09090b] border-l border-white/5 items-center justify-center">
        
        {/* Abstract shapes & glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0052FF]/20 to-[#8B5CF6]/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-lg p-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 mb-8 mx-auto">
            <Sparkles size={16} className="text-[#0052FF]" />
            <span className="text-sm font-medium text-zinc-300">Únete a la élite</span>
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Descubre conexiones <br/>que transforman tu <br/> <span className="text-gradient">carrera.</span>
          </h2>
          
          <p className="text-lg text-zinc-400">
            Miles de profesionales ya están utilizando NebriMatch para encontrar su próximo gran proyecto.
          </p>
          
          {/* Faux UI element floating */}
          <div className="mt-12 mx-auto w-[300px] h-[200px] glass-card rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden text-left">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0052FF] to-[#8B5CF6]" />
             <div className="flex gap-4 items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div>
                   <div className="w-24 h-4 bg-white/10 rounded-md mb-2" />
                   <div className="w-16 h-3 bg-white/5 rounded-md" />
                </div>
             </div>
             <div className="space-y-2 mt-6">
                <div className="w-full h-3 bg-white/5 rounded-md" />
                <div className="w-5/6 h-3 bg-white/5 rounded-md" />
                <div className="w-4/6 h-3 bg-white/5 rounded-md" />
             </div>
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 mask-image-linear-gradient" />
        
      </div>
    </div>
  );
}
