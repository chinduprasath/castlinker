
import Hero from "@/components/Hero";
import RoleSelection from "@/components/RoleSelection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-cinematic'} text-foreground`}>
      <Hero />
      <div className={theme === 'light' ? 'bg-amber-50/60' : ''}>
        <RoleSelection />
      </div>
      <Features />
      <div className={theme === 'light' ? 'bg-amber-50/60' : ''}>
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
