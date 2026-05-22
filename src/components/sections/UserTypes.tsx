"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { GraduationCap, Award, Briefcase, Laptop, Lightbulb, Building2 } from "lucide-react";

const userTypes = [
  {
    icon: GraduationCap,
    title: "Estudiantes",
    description: "Encuentra prácticas, proyectos de universidad o mentores para dar tus primeros pasos.",
  },
  {
    icon: Award,
    title: "Graduados",
    description: "Conecta con empresas y startups que buscan el talento joven más prometedor.",
  },
  {
    icon: Briefcase,
    title: "Profesionales",
    description: "Amplía tu red de contactos, explora nuevas oportunidades o comparte tu experiencia.",
  },
  {
    icon: Laptop,
    title: "Freelancers",
    description: "Encuentra clientes, proyectos interesantes y otros freelancers con los que colaborar.",
  },
  {
    icon: Lightbulb,
    title: "Emprendedores",
    description: "Busca co-fundadores, primeros empleados y validación para tus ideas locas.",
  },
  {
    icon: Building2,
    title: "Empresas",
    description: "Recluta el mejor talento directamente, sin intermediarios ni procesos lentos.",
  },
];

export function UserTypes() {
  return (
    <SectionWrapper id="comunidad" className="relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Una comunidad para cada etapa
          </h2>
          <p className="text-zinc-400 text-lg">
            No importa si estás empezando o si ya tienes tu propia empresa. NebriMatch es el lugar perfecto para conectar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">{type.title}</h3>
                <p className="text-zinc-400">{type.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
