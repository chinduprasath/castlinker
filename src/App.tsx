
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";

// Layouts
import AppLayout from '@/components/AppLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import Jobs from '@/pages/Jobs';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import TalentDirectory from '@/pages/TalentDirectory';
import IndustryHub from '@/pages/IndustryHub';
import Chat from '@/pages/Chat';
import Billing from '@/pages/Billing';
import Notifications from '@/pages/Notifications';
import Help from '@/pages/Help';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';
import BlogPage from '@/pages/BlogPage';
import Events from '@/pages/Events';

// Admin Pages
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import JobManagement from '@/pages/admin/JobManagement';
import EventManagement from '@/pages/admin/EventManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import Analytics from '@/pages/admin/Analytics';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';

// Guards
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <AppLayout>
              <Index />
            </AppLayout>
          }
        />
        <Route 
          path="/login" 
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />
        <Route 
          path="/signup" 
          element={
            <AppLayout>
              <Signup />
            </AppLayout>
          }
        />
        <Route 
          path="/about" 
          element={
            <AppLayout>
              <About />
            </AppLayout>
          }
        />
        <Route 
          path="/features" 
          element={
            <AppLayout>
              <Features />
            </AppLayout>
          }
        />
        <Route 
          path="/pricing" 
          element={
            <AppLayout>
              <Pricing />
            </AppLayout>
          }
        />
        <Route 
          path="/contact" 
          element={
            <AppLayout>
              <Contact />
            </AppLayout>
          }
        />
        <Route 
          path="/privacy" 
          element={
            <AppLayout>
              <Privacy />
            </AppLayout>
          }
        />
        <Route 
          path="/blog" 
          element={
            <AppLayout>
              <BlogPage />
            </AppLayout>
          }
        />
        <Route 
          path="/events" 
          element={
            <AppLayout>
              <Events />
            </AppLayout>
          }
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/jobs" element={
          <PrivateRoute>
            <AppLayout>
              <Jobs />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/talent-directory" element={
          <PrivateRoute>
            <AppLayout>
              <TalentDirectory />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/industry-hub" element={
          <PrivateRoute>
            <AppLayout>
              <IndustryHub />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <AppLayout>
              <Chat />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/billing" element={
          <PrivateRoute>
            <AppLayout>
              <Billing />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/help" element={
          <PrivateRoute>
            <AppLayout>
              <Help />
            </AppLayout>
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminRouteGuard>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/users" element={
          <AdminRouteGuard>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/jobs" element={
          <AdminRouteGuard>
            <AdminLayout>
              <JobManagement />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/events" element={
          <AdminRouteGuard>
            <AdminLayout>
              <EventManagement />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/content" element={
          <AdminRouteGuard>
            <AdminLayout>
              <ContentModeration />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/analytics" element={
          <AdminRouteGuard>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/notifications" element={
          <AdminRouteGuard>
            <AdminLayout>
              <AdminNotifications />
            </AdminLayout>
          </AdminRouteGuard>
        } />
        <Route path="/admin/settings" element={
          <AdminRouteGuard>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </AdminRouteGuard>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster />
    </Router>
  );
};

export default App;
