import { AboutSection } from "@/components/AboutSection";
import { CinematicIntro } from "@/components/CinematicIntro";
import { ContactSection } from "@/components/ContactSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectRail } from "@/components/ProjectRail";

export default function HomePage() {
  return (
    <main>
      <CinematicIntro />

      <AboutSection />

      <EducationSection />

      <ExperienceSection />

      <ProjectRail />

      <ContactSection />
    </main>
  );
}
