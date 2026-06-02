import SiteHeader from "@/components/SiteHeader";
import SideLabel from "@/components/SideLabel";
import SectionCounter from "@/components/SectionCounter";
import VerticalFlowText from "@/components/VerticalFlowText";
import CircularBadge from "@/components/CircularBadge";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HorizontalScrollText from "@/components/HorizontalScrollText";
import FeaturedProjectSection from "@/components/FeaturedProjectSection";
import ProjectTransition from "@/components/ProjectTransition";
import SelectedToolsSection from "@/components/SelectedToolsSection";
import WritingSection from "@/components/WritingSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <CircularBadge />
      <SideLabel />
      <VerticalFlowText />
      <SectionCounter />
      <HeroSection />
      <AboutSection />
      <HorizontalScrollText />
      <FeaturedProjectSection />
      <ProjectTransition />
      <SelectedToolsSection />
      <HorizontalScrollText
        text="CLINICAL SOFTWARE — SMALL TOOLS — CLINICAL SOFTWARE — SMALL TOOLS —"
        background="#0b0b0b"
        color="rgba(255,255,255,0.06)"
      />
      <WritingSection />
      <ContactSection />
    </main>
  );
}
