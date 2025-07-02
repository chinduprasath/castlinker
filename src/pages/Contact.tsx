import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Contact = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Contact form submitted:", { name, email, subject, message });
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-cinematic text-foreground'} transition-colors`}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 gold-gradient-text text-center">Get in Touch</h1>
          <p className={`text-xl text-center max-w-2xl mx-auto mb-12 ${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'}`}>
            Have questions about CastLinker? Need help with your account? We're here to assist you.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className={`flex flex-col items-center text-center rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-gold/20 ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'}`}>
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} mb-4`}>Our support team is always ready to help</p>
              <a href="mailto:info@castlinker.com" className="text-gold hover:text-gold-light">
                info@castlinker.com
              </a>
            </div>
            
            <div className={`flex flex-col items-center text-center rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-gold/20 ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'}`}>
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} mb-4`}>Mon-Fri, 9am-5pm (PST)</p>
              <a href="tel:+18005551234" className="text-gold hover:text-gold-light">
                +1 (800) 555-1234
              </a>
            </div>
            
            <div className={`flex flex-col items-center text-center rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-gold/20 ${theme === 'light' ? 'bg-gray-300' : 'bg-cinematic-dark/50'}`}>
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} mb-4`}>Our headquarters</p>
              <address className="text-gold hover:text-gold-light not-italic">
                123 Film Boulevard<br />
                Los Angeles, CA 90028
              </address>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className={`lg:col-span-2 rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">How do I get verified on CastLinker?</h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>
                    Verification is available for Professional and Premium subscribers. Submit your credentials and industry proof for review.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>
                    Yes, you can cancel your subscription at any time from your account settings. Refunds are processed according to our refund policy.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">How do I report inappropriate content?</h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>
                    You can report any content using the "Report" button found on profiles, posts, and job listings.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Is my data secure on CastLinker?</h3>
                  <p className={`${theme === 'light' ? 'text-gray-700' : 'text-foreground/70'} text-sm`}>
                    Yes, we use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for more details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`lg:col-span-3 rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-card-gradient border-gold/10'}`}>
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      className={`focus:border-gold ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-cinematic-dark/50 border-gold/10'}`}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com" 
                      className={`focus:border-gold ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-cinematic-dark/50 border-gold/10'}`}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger className={`focus:border-gold ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-cinematic-dark/50 border-gold/10'}`}>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?" 
                    className={`min-h-[150px] focus:border-gold ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-cinematic-dark/50 border-gold/10'}`}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-gold-dark text-cinematic"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cinematic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
