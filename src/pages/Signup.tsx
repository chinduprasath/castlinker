
import Footer from "@/components/Footer";
import SignupForm from "@/components/auth/SignupForm";
import { useTheme } from "@/contexts/ThemeContext";

const Signup = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-cinematic'} text-foreground`}>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto pt-10 pb-16">
          <SignupForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
