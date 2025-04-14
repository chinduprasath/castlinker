
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import TalentDirectory from "./pages/TalentDirectory";
import { ChatPage } from "./components/chat/ChatPage"; 
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<TalentDirectory />} />
        <Route path="/talent-directory" element={<TalentDirectory />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
