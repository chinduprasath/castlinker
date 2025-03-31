
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-cinematic-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gold/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gold/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="bg-card-gradient border border-gold/10 rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Your Film Career to the <span className="gold-gradient-text">Next Level</span>?
          </h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of film professionals already using CastLinker to find opportunities, 
            showcase their work, and connect with the industry's best talent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-cinematic px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-gold/30 hover:border-gold">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
