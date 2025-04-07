
import Hero from "@/components/Hero";
import RoleSelection from "@/components/RoleSelection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    // Add a slight delay to check user login state to avoid flash of landing page
    const timer = setTimeout(() => {
      // Check if user is logged in, redirect to dashboard
      if (user) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate, user]);

  // Show a temporary loading state while checking user login
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinematic">
        <div className="text-center">
          <h1 className="text-3xl font-bold gold-gradient-text mb-4">CastLinker</h1>
          <div className="flex space-x-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for non-logged in users
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      {/* Navigation for non-logged in users */}
      <nav className="border-b border-gold/10 p-4 flex justify-between items-center bg-background/30 backdrop-blur-md">
        <div className="text-2xl font-bold gold-gradient-text">CastLinker</div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/login')} className="border-gold/30 text-gold hover:bg-gold/10 dark:text-gold-light">
            Log In
          </Button>
          <Button onClick={() => navigate('/signup')} className="bg-gold text-white dark:text-black hover:bg-gold/90">
            Sign Up
          </Button>
        </div>
      </nav>
      
      <Hero />
      <RoleSelection />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
