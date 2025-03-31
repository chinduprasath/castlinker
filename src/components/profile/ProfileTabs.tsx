
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutSection from "./AboutSection";
import PortfolioSection from "./PortfolioSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Tabs defaultValue="about" className="mt-8" onValueChange={setActiveTab}>
      <TabsList className="bg-cinematic-dark/50 border border-gold/10 w-full justify-start">
        <TabsTrigger 
          value="about" 
          className={`${activeTab === 'about' ? 'text-gold border-gold' : 'text-foreground/70 border-transparent'} 
            border-b-2 rounded-none`}
        >
          About
        </TabsTrigger>
        <TabsTrigger 
          value="portfolio" 
          className={`${activeTab === 'portfolio' ? 'text-gold border-gold' : 'text-foreground/70 border-transparent'} 
            border-b-2 rounded-none`}
        >
          Portfolio
        </TabsTrigger>
        <TabsTrigger 
          value="skills" 
          className={`${activeTab === 'skills' ? 'text-gold border-gold' : 'text-foreground/70 border-transparent'} 
            border-b-2 rounded-none`}
        >
          Skills & Attributes
        </TabsTrigger>
        <TabsTrigger 
          value="experience" 
          className={`${activeTab === 'experience' ? 'text-gold border-gold' : 'text-foreground/70 border-transparent'} 
            border-b-2 rounded-none`}
        >
          Experience
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="pt-6">
        <AboutSection />
      </TabsContent>
      <TabsContent value="portfolio" className="pt-6">
        <PortfolioSection />
      </TabsContent>
      <TabsContent value="skills" className="pt-6">
        <SkillsSection />
      </TabsContent>
      <TabsContent value="experience" className="pt-6">
        <ExperienceSection />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
