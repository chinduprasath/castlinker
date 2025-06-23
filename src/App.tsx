
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import AppLayout from '@/components/AppLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import Jobs from '@/pages/Jobs';
import Posts from '@/pages/Posts';
import PostDetail from '@/pages/PostDetail';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import TalentDirectory from '@/pages/TalentDirectory';
import IndustryHub from '@/pages/IndustryHub';
import Chat from '@/pages/Chat';
import Billing from '@/pages/Billing';
import Notifications from '@/pages/Notifications';
import Help from '@/pages/Help';
import Privacy from '@/pages/Privacy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import CancellationRefundPolicy from '@/pages/CancellationRefundPolicy';
import NotFound from '@/pages/NotFound';
import BlogPage from '@/pages/BlogPage';
import Events from '@/pages/Events';

// Project Pages
import Projects from '@/pages/Projects';
import ProjectCreate from '@/pages/ProjectCreate';
import ProjectDetail from '@/pages/ProjectDetail';

// New Pages
import Messages from '@/pages/Messages';
import Tickets from '@/pages/Tickets';

// Admin Pages
import AdminLogin from '@/pages/AdminLogin';
import SuperAdminSignup from '@/pages/SuperAdminSignup';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProfile from '@/pages/admin/AdminProfile';
import UserManagement from '@/pages/admin/UserManagement';
import JobManagement from '@/pages/admin/JobManagement';
import PostManagement from '@/pages/admin/PostManagement';
import EventManagement from '@/pages/admin/EventManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import Analytics from '@/pages/admin/Analytics';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';
import TeamManagement from "./pages/admin/TeamManagement";
import AdminTicketManagement from '@/pages/admin/AdminTicketManagement';
import AdminTicketDetail from '@/pages/admin/AdminTicketDetail';
import AdminJobDetail from '@/pages/admin/AdminJobDetail';
import AdminPostDetail from '@/pages/admin/AdminPostDetail';
import ManagePage from '@/pages/ManagePage';
import UserJobDetail from '@/pages/UserJobDetail';
import UserPostDetail from '@/pages/UserPostDetail';

// Guards
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/super-admin-signup" element={<SuperAdminSignup />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
              <Route path="/jobs" element={<PrivateRoute><AppLayout><Jobs /></AppLayout></PrivateRoute>} />
              <Route path="/projects" element={<PrivateRoute><AppLayout><Projects /></AppLayout></PrivateRoute>} />
              <Route path="/posts" element={<PrivateRoute><AppLayout><Posts /></AppLayout></PrivateRoute>} />
              <Route path="/posts/:id" element={<PrivateRoute><AppLayout><PostDetail /></AppLayout></PrivateRoute>} />
              <Route path="/talent-directory" element={<PrivateRoute><AppLayout><TalentDirectory /></AppLayout></PrivateRoute>} />
              <Route path="/industry-hub" element={<PrivateRoute><AppLayout><IndustryHub /></AppLayout></PrivateRoute>} />
              <Route path="/events" element={<PrivateRoute><AppLayout><Events /></AppLayout></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><AppLayout><Messages /></AppLayout></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><AppLayout><Notifications /></AppLayout></PrivateRoute>} />
              <Route path="/tickets" element={<PrivateRoute><AppLayout><Tickets /></AppLayout></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><AppLayout><Settings /></AppLayout></PrivateRoute>} />
              <Route path="/billing" element={<PrivateRoute><AppLayout><Billing /></AppLayout></PrivateRoute>} />
              <Route path="/manage" element={<PrivateRoute><AppLayout><ManagePage /></AppLayout></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><AppLayout><Chat /></AppLayout></PrivateRoute>} />

              {/* Job and project specific routes */}
              <Route path="/job/:id" element={<PrivateRoute><AppLayout><UserJobDetail /></AppLayout></PrivateRoute>} />
              <Route path="/post/:id" element={<PrivateRoute><AppLayout><UserPostDetail /></AppLayout></PrivateRoute>} />
              <Route path="/projects/create" element={<PrivateRoute><AppLayout><ProjectCreate /></AppLayout></PrivateRoute>} />
              <Route path="/projects/:id" element={<PrivateRoute><AppLayout><ProjectDetail /></AppLayout></PrivateRoute>} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminRouteGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/dashboard" element={<AdminRouteGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/users" element={<AdminRouteGuard><AdminLayout><UserManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/jobs" element={<AdminRouteGuard><AdminLayout><JobManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/jobs/:id" element={<AdminRouteGuard><AdminLayout><AdminJobDetail /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/posts" element={<AdminRouteGuard><AdminLayout><PostManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/posts/:id" element={<AdminRouteGuard><AdminLayout><AdminPostDetail /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/events" element={<AdminRouteGuard><AdminLayout><EventManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/content" element={<AdminRouteGuard><AdminLayout><ContentModeration /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/analytics" element={<AdminRouteGuard><AdminLayout><Analytics /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/team" element={<AdminRouteGuard><AdminLayout><TeamManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/tickets" element={<AdminRouteGuard><AdminLayout><AdminTicketManagement /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/tickets/:id" element={<AdminRouteGuard><AdminLayout><AdminTicketDetail /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/settings" element={<AdminRouteGuard><AdminLayout><AdminSettings /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/profile" element={<AdminRouteGuard><AdminLayout><AdminProfile /></AdminLayout></AdminRouteGuard>} />
              <Route path="/admin/notifications" element={<AdminRouteGuard><AdminLayout><AdminNotifications /></AdminLayout></AdminRouteGuard>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
