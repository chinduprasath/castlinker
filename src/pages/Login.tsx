
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { useTheme } from "@/contexts/ThemeContext";

const Login = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-b from-amber-50 to-white' : 'bg-cinematic'} text-foreground`}>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto pt-10 pb-16">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
