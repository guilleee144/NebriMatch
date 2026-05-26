"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  User as UserIcon, 
  Mail, 
  Key, 
  MapPin, 
  Briefcase, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Save, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Trash2
} from "lucide-react";

interface ProfileData {
  description: string;
  profile_picture: string;
  "empresa/centro_estudios": string;
  edad: number | "";
  ciudad: string;
}

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData>({
    description: "",
    profile_picture: "",
    "empresa/centro_estudios": "",
    edad: "",
    ciudad: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/user/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener el perfil");
          return res.json();
        })
        .then((data) => {
          setProfile({
            description: data.profile.description || "",
            profile_picture: data.profile.profile_picture || "",
            "empresa/centro_estudios": data.profile["empresa/centro_estudios"] || "",
            edad: data.profile.edad !== null && data.profile.edad !== undefined ? data.profile.edad : "",
            ciudad: data.profile.ciudad || "",
          });
        })
        .catch((err) => {
          console.error(err);
          setError("No se pudo cargar la información del perfil.");
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProfile((prev) => ({
      ...prev,
      edad: val === "" ? "" : Number(val),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo en el frontend (jpeg, jpg, png)
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!validExtensions.includes(file.type)) {
      setError("Formato de imagen no válido. Solo se admiten archivos jpeg, jpg o png.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profile_picture: reader.result as string, // Guarda el Base64 completo
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = () => {
    setProfile((prev) => ({
      ...prev,
      profile_picture: "", // Deja el campo vacío
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          edad: profile.edad === "" ? null : profile.edad,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0052FF]" size={40} />
          <p className="text-zinc-400 text-sm font-medium">Cargando tus ajustes...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, evitar renderizado mientras redirige
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Determinar si hay una imagen personalizada guardada (Base64 o URL previa)
  const hasCustomPic = profile.profile_picture && profile.profile_picture.length > 5;

  return (
    <>
      <Navbar />

      <main className="relative h-[calc(100vh-64px)] overflow-y-auto bg-[#050505] pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />

        {/* Back Link */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al panel
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ajustes de Perfil
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Gestiona la información profesional que compartes en NebriMatch.
          </p>
        </div>

        {/* Form & Cards Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Col: Avatar Preview */}
            <div className="glass-card border border-white/10 rounded-3xl p-6 bg-[#09090b]/80 backdrop-blur-2xl flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
                Foto de Perfil
              </h3>
              
              <div 
                onClick={triggerFileInput}
                className="relative mb-6 group cursor-pointer"
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] opacity-30 group-hover:opacity-60 blur-md transition-opacity duration-500" />
                <div className="relative w-28 h-28 rounded-3xl bg-[#111115] hover:bg-[#181820] flex items-center justify-center text-white font-extrabold text-3xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300">
                  {hasCustomPic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={profile.profile_picture} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                      onError={removeProfilePicture}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <Upload size={20} className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full py-2 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload size={12} />
                  Subir imagen
                </button>
                
                {hasCustomPic && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="w-full py-2 px-4 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 hover:text-red-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    Eliminar foto
                  </button>
                )}
              </div>
            </div>

            {/* Right Col: Fields */}
            <div className="md:col-span-2 glass-card border border-white/10 rounded-3xl p-6 sm:p-8 bg-[#09090b]/80 backdrop-blur-2xl space-y-6">
              
              {/* Alert Feedback */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>¡Ajustes guardados correctamente!</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Editables Section */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Key size={14} className="text-[#0052FF]" />
                  Información Básica (No editable)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-500">Nombre completo</label>
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-zinc-400 select-none">
                      <UserIcon size={16} className="text-zinc-600" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-500">Correo electrónico</label>
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-zinc-400 select-none">
                      <Mail size={16} className="text-zinc-600" />
                      <span className="text-sm truncate">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-white/5" />

              {/* Editables Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={14} />
                  Perfil Profesional
                </h3>

                {/* Profile Picture Controller (Device Only) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-zinc-400">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0052FF] to-[#8B5CF6] flex items-center justify-center text-white text-lg font-bold shrink-0 overflow-hidden border border-white/10">
                      {hasCustomPic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.profile_picture} alt="Mini Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-300">
                        {hasCustomPic ? "Imagen cargada localmente" : "Usando inicial predeterminada"}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Formatos aceptados: JPEG, JPG, PNG
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="py-2 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all shrink-0 cursor-pointer"
                    >
                      Examinar...
                    </button>
                  </div>
                </div>

                {/* Description / Bio */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-xs font-medium text-zinc-400">
                    Biografía / Descripción Profesional
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-zinc-600">
                      <FileText size={16} />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={profile.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Cuéntanos sobre tus habilidades, proyectos y lo que buscas..."
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/50 focus:border-[#0052FF] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Empresa / Centro de Estudios */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="empresa/centro_estudios" className="text-xs font-medium text-zinc-400">
                    Empresa o Centro de Estudios
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="text"
                      id="empresa/centro_estudios"
                      name="empresa/centro_estudios"
                      value={profile["empresa/centro_estudios"]}
                      onChange={handleInputChange}
                      placeholder="Ej. Universidad Nebrija / Stripe"
                      className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/50 focus:border-[#0052FF] transition-all"
                    />
                  </div>
                </div>

                {/* Edad & Ciudad (2 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Edad */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="edad" className="text-xs font-medium text-zinc-400">
                      Edad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="number"
                        id="edad"
                        name="edad"
                        value={profile.edad}
                        onChange={handleAgeChange}
                        placeholder="Ej. 24"
                        min="1"
                        max="120"
                        className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/50 focus:border-[#0052FF] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  {/* Ciudad */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="ciudad" className="text-xs font-medium text-zinc-400">
                      Ciudad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        id="ciudad"
                        name="ciudad"
                        value={profile.ciudad}
                        onChange={handleInputChange}
                        placeholder="Ej. Madrid, España"
                        className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/50 focus:border-[#0052FF] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sticky bottom-0 mt-8 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 flex justify-end rounded-b-3xl z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <button
                  type="submit"
                  disabled={saving}
                  className="py-3 px-8 rounded-2xl bg-white hover:bg-zinc-200 text-black font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>

      </main>

    </>
  );
}
