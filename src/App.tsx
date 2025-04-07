
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
        <Route element={<PrivateRoute />}>
          <Route 
            path="/dashboard" 
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route 
            path="/jobs" 
            element={
              <AppLayout>
                <Jobs />
              </AppLayout>
            }
          />
          <Route 
            path="/profile" 
            element={
              <AppLayout>
                <Profile />
              </AppLayout>
            }
          />
          <Route 
            path="/settings" 
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
          <Route 
            path="/talent-directory" 
            element={
              <AppLayout>
                <TalentDirectory />
              </AppLayout>
            }
          />
          <Route 
            path="/industry-hub" 
            element={
              <AppLayout>
                <IndustryHub />
              </AppLayout>
            }
          />
          <Route 
            path="/chat" 
            element={
              <AppLayout>
                <Chat />
              </AppLayout>
            }
          />
          <Route 
            path="/billing" 
            element={
              <AppLayout>
                <Billing />
              </AppLayout>
            }
          />
          <Route 
            path="/notifications" 
            element={
              <AppLayout>
                <Notifications />
              </AppLayout>
            }
          />
          <Route 
            path="/help" 
            element={
              <AppLayout>
                <Help />
              </AppLayout>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRouteGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/jobs" element={<JobManagement />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/content" element={<ContentModeration />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster />
    </Router>
  );
};

export default App;
