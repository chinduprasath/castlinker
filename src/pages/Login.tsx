
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
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
