import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Timeline } from "@/components/sections/Timeline";
import { Features } from "@/components/sections/Features";
import { UserTypes } from "@/components/sections/UserTypes";
import { ProjectMode, TechStack } from "@/components/sections/ProjectMode";
import { Stats, CTA } from "@/components/sections/StatsCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* ⚠️ REQUISITO CRÍTICO: main nunca debe tener overflow-hidden */}
      <main className="relative">
        <Hero />
        <Timeline />
        <Features />
        <ProjectMode />
        <UserTypes />
        <TechStack />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
