
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'light' ? 'bg-gray-50' : 'bg-background'}`}>
      <Shield className="h-12 w-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className={`${theme === 'light' ? 'text-gray-600' : 'text-muted-foreground'} mb-4`}>You don't have permission to access the admin panel.</p>
      <Button onClick={() => navigate("/")}>Return to Home</Button>
    </div>
  );
};

export default AccessDenied;
