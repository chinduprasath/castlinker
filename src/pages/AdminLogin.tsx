
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto pt-10 pb-16">
          <AdminLoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
