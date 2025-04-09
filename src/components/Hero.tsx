
import { motion } from "framer-motion";
import { ArrowRight, Video, UserCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DemoVideo from "./DemoVideo";

const Hero = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden film-strip">
      <div 
        className="absolute inset-0 bg-hero-gradient"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2156&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          opacity: 0.4
        }}
      />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Connect <span className="gold-gradient-text">Talent</span> with <span className="gold-gradient-text">Opportunity</span> in the Film Industry
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            The premier networking platform for film professionals. Build your portfolio, discover talent, and land your next role in the entertainment industry.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-cinematic px-8 w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gold/30 hover:border-gold w-full sm:w-auto"
              onClick={() => setIsDemoOpen(true)}
            >
              Watch Demo
              <Video className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <div className="hero-card p-4 sm:p-6 flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Industry Verified</h3>
              <p className="text-sm sm:text-base text-foreground/70 text-center">Connect with verified film industry professionals and production houses.</p>
            </div>
            
            <div className="hero-card p-4 sm:p-6 flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Showcase Talent</h3>
              <p className="text-sm sm:text-base text-foreground/70 text-center">Build a stunning portfolio to highlight your skills and previous work.</p>
            </div>
            
            <div className="hero-card p-4 sm:p-6 flex flex-col items-center sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Virtual Auditions</h3>
              <p className="text-sm sm:text-base text-foreground/70 text-center">Submit and review audition videos with advanced feedback tools.</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Demo Video Modal */}
      <DemoVideo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  );
};

export default Hero;
