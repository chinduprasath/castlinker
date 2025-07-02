import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

const About = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-cinematic text-foreground'} transition-colors`}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 gold-gradient-text">About CastLinker</h1>
          
          <div className={`rounded-xl p-8 mb-12 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-foreground/80'}`}>
              At CastLinker, we're revolutionizing how film industry professionals connect, collaborate, and create. 
              Our platform bridges the gap between talent and opportunity, making the film industry more accessible 
              and transparent for everyone involved.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-foreground/80'}`}>
              Founded in 2023 by a team of film industry veterans and tech innovators, CastLinker was born from a 
              shared frustration: the film industry's reliance on closed networks and gatekeepers. We envisioned 
              a platform where talent could be discovered based on merit, not connections.
            </p>
            
            <div className="my-8">
              <Separator className="bg-gold/20" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className={`${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'} h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20`}>
                  <span className="text-3xl text-gold">10K+</span>
                </div>
                <h3 className="font-semibold mb-2">Active Professionals</h3>
                <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'}`}>From actors to cinematographers</p>
              </div>
              
              <div className="text-center">
                <div className={`${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'} h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20`}>
                  <span className="text-3xl text-gold">500+</span>
                </div>
                <h3 className="font-semibold mb-2">Productions</h3>
                <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'}`}>Films, series, and commercials</p>
              </div>
              
              <div className="text-center">
                <div className={`${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'} h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20`}>
                  <span className="text-3xl text-gold">30+</span>
                </div>
                <h3 className="font-semibold mb-2">Countries</h3>
                <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'}`}>Global talent network</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-8 mb-12 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
            <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className={`h-16 w-16 rounded-full border border-gold/20 flex items-center justify-center ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark'}`}>
                  <span className="text-xl font-bold">SB</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Sarah Bennett</h3>
                  <p className="text-gold mb-1">CEO & Co-Founder</p>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>Former casting director with 15+ years of experience in major studios.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`h-16 w-16 rounded-full border border-gold/20 flex items-center justify-center ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark'}`}>
                  <span className="text-xl font-bold">MR</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Michael Rodriguez</h3>
                  <p className="text-gold mb-1">CTO & Co-Founder</p>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>Tech entrepreneur with a background in AI and machine learning.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`h-16 w-16 rounded-full border border-gold/20 flex items-center justify-center ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark'}`}>
                  <span className="text-xl font-bold">JW</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Jessica Wong</h3>
                  <p className="text-gold mb-1">Head of Talent Relations</p>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>Former talent agent who has represented A-list actors.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className={`h-16 w-16 rounded-full border border-gold/20 flex items-center justify-center ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark'}`}>
                  <span className="text-xl font-bold">DT</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">David Thompson</h3>
                  <p className="text-gold mb-1">Lead Product Designer</p>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>UX specialist with a passion for creating intuitive interfaces.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
