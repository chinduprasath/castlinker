
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Film Industry Blog</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Stay updated with the latest news, insights, and trends from the film industry.
          </p>
          
          <div className="space-y-12">
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-2">The Rise of Virtual Production in Film</h2>
              <p className="text-sm text-foreground/60 mb-4">April 2, 2025 • 10 min read</p>
              <p className="text-foreground/80 mb-6">
                Virtual production is revolutionizing how films are made. This article explores the 
                technology behind it and how filmmakers are leveraging it to create stunning visuals.
              </p>
              <a href="#" className="text-gold hover:underline">Read more →</a>
            </div>
            
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-2">Networking Tips for New Actors</h2>
              <p className="text-sm text-foreground/60 mb-4">March 28, 2025 • 8 min read</p>
              <p className="text-foreground/80 mb-6">
                Breaking into the film industry can be challenging. Learn effective networking 
                strategies that can help new actors get noticed and land their first roles.
              </p>
              <a href="#" className="text-gold hover:underline">Read more →</a>
            </div>
            
            <div className="bg-card-gradient border border-gold/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-2">Sustainable Filmmaking: The Future of Production</h2>
              <p className="text-sm text-foreground/60 mb-4">March 20, 2025 • 12 min read</p>
              <p className="text-foreground/80 mb-6">
                As the industry evolves, sustainability becomes increasingly important. Discover how 
                production companies are implementing eco-friendly practices on set.
              </p>
              <a href="#" className="text-gold hover:underline">Read more →</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
