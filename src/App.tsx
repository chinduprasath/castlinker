
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import IndustryHub from "./pages/IndustryHub";
import TalentDirectory from "./pages/TalentDirectory";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Privacy from "./pages/Privacy";
import Billing from "./pages/Billing";
import Help from "./pages/Help";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import JobManagement from "./pages/admin/JobManagement";
import EventManagement from "./pages/admin/EventManagement";
import Analytics from "./pages/admin/Analytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/help" element={<Help />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path="/industry-hub" element={<PrivateRoute><IndustryHub /></PrivateRoute>} />
                <Route path="/talent-directory" element={<PrivateRoute><TalentDirectory /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <AdminDashboard />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard requiredPermission="user_view">
                        <UserManagement />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/content" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard requiredPermission="content_view">
                        <ContentModeration />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/jobs" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <JobManagement />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/events" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <EventManagement />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/analytics" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <Analytics />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/notifications" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <AdminNotifications />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <PrivateRoute>
                      <AdminRouteGuard>
                        <AdminSettings />
                      </AdminRouteGuard>
                    </PrivateRoute>
                  } 
                />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
