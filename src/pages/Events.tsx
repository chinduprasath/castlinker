
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const Events = () => {
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Industry Events</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Connect with industry professionals at these upcoming events.
          </p>
          
          <div className="space-y-8">
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="bg-gold/20 text-gold rounded-lg p-3 text-center">
                    <span className="block text-sm">APR</span>
                    <span className="block text-3xl font-bold">15</span>
                    <span className="block text-sm">2025</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">International Film Networking Summit</h2>
                  <p className="text-foreground/60 flex items-center mb-4">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    April 15-17, 2025 • Los Angeles Convention Center
                  </p>
                  <p className="text-foreground/80 mb-6">
                    Connect with directors, producers, and actors from around the world at this premier 
                    networking event for film industry professionals.
                  </p>
                  <Button className="bg-gold hover:bg-gold-dark text-cinematic">Register Now</Button>
                </div>
              </div>
            </div>
            
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="bg-gold/20 text-gold rounded-lg p-3 text-center">
                    <span className="block text-sm">MAY</span>
                    <span className="block text-3xl font-bold">22</span>
                    <span className="block text-sm">2025</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">New Talent Showcase</h2>
                  <p className="text-foreground/60 flex items-center mb-4">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    May 22, 2025 • New York Film Academy
                  </p>
                  <p className="text-foreground/80 mb-6">
                    A platform for emerging actors, directors, and screenwriters to showcase their work to 
                    industry professionals and get feedback from established experts.
                  </p>
                  <Button className="bg-gold hover:bg-gold-dark text-cinematic">Register Now</Button>
                </div>
              </div>
            </div>
            
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="bg-gold/20 text-gold rounded-lg p-3 text-center">
                    <span className="block text-sm">JUN</span>
                    <span className="block text-3xl font-bold">10</span>
                    <span className="block text-sm">2025</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">Cinematography Masterclass</h2>
                  <p className="text-foreground/60 flex items-center mb-4">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    June 10, 2025 • Virtual Event
                  </p>
                  <p className="text-foreground/80 mb-6">
                    Learn from award-winning cinematographers in this exclusive online masterclass covering 
                    lighting techniques, camera movement, and visual storytelling.
                  </p>
                  <Button className="bg-gold hover:bg-gold-dark text-cinematic">Register Now</Button>
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

export default Events;
