
import { motion } from "framer-motion";
import { Search, MessageSquare, CalendarClock, Brain } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-gold mb-4" />,
      title: "AI-Powered Search",
      description: "Discover talent and opportunities using advanced filters for skills, location, experience, and availability."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-gold mb-4" />,
      title: "Private Messaging",
      description: "Connect directly with industry professionals through our secure messaging system."
    },
    {
      icon: <CalendarClock className="h-10 w-10 text-gold mb-4" />,
      title: "Audition Management",
      description: "Post auditions, schedule submissions, and organize casting calls all in one place."
    },
    {
      icon: <Brain className="h-10 w-10 text-gold mb-4" />,
      title: "AI Profile Optimization",
      description: "Get tailored recommendations to enhance your profile and increase visibility."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful <span className="gold-gradient-text">Features</span> for Film Professionals</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our platform provides the tools you need to showcase your talent, connect with others, and advance your career in the film industry.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="feature-card"
              variants={item}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
