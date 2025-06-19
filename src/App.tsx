
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/contexts/ThemeContext';

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

// Admin Pages
import AdminLogin from '@/pages/AdminLogin';
import SuperAdminSignin from '@/pages/SuperAdminSignin';
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

const App = () => {
  return (
    <ThemeProvider>
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
            path="/forgot-password" 
            element={
              <ForgotPassword />
            }
          />
          <Route 
            path="/reset-password" 
            element={
              <ResetPassword />
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
            path="/terms" 
            element={
              <AppLayout>
                <TermsAndConditions />
              </AppLayout>
            }
          />
          <Route 
            path="/cancellation-refund" 
            element={
              <AppLayout>
                <CancellationRefundPolicy />
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

          {/* User Dashboard Routes - Now Public */}
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/jobs" element={
            <AppLayout>
              <Jobs />
            </AppLayout>
          } />
          <Route path="/posts" element={
            <AppLayout>
              <Posts />
            </AppLayout>
          } />
          <Route path="/posts/:id" element={
            <AppLayout>
              <PostDetail />
            </AppLayout>
          } />
          <Route path="/profile" element={
            <AppLayout>
              <Profile />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="/talent-directory" element={
            <AppLayout>
              <TalentDirectory />
            </AppLayout>
          } />
          <Route path="/industry-hub" element={
            <AppLayout>
              <IndustryHub />
            </AppLayout>
          } />
          <Route path="/chat" element={
            <AppLayout>
              <Chat />
            </AppLayout>
          } />
          <Route path="/billing" element={
            <AppLayout>
              <Billing />
            </AppLayout>
          } />
          <Route path="/notifications" element={
            <AppLayout>
              <Notifications />
            </AppLayout>
          } />
          <Route path="/help" element={
            <AppLayout>
              <Help />
            </AppLayout>
          } />
          <Route path="/manage" element={
            <AppLayout>
              <ManagePage />
            </AppLayout>
          } />
          <Route path="/manage/jobs/:jobId" element={
            <AppLayout>
              <UserJobDetail />
            </AppLayout>
          } />
          <Route path="/manage/posts/:postId" element={
            <AppLayout>
              <UserPostDetail />
            </AppLayout>
          } />

          {/* Project Routes - Now Public */}
          <Route path="/projects" element={
            <AppLayout>
              <Projects />
            </AppLayout>
          } />
          <Route path="/projects/create" element={
            <AppLayout>
              <ProjectCreate />
            </AppLayout>
          } />
          <Route path="/projects/:projectId" element={
            <AppLayout>
              <ProjectDetail />
            </AppLayout>
          } />

          {/* Admin Routes - Now Public */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/superadmin-signin" element={<SuperAdminSignin />} />
          <Route path="/superadmin-signup" element={<SuperAdminSignup />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/profile" 
            element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/team" 
            element={
              <AdminLayout>
                <TeamManagement />
              </AdminLayout>
            } 
          />
          <Route path="/admin/users" element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          } />
          <Route path="/admin/jobs" element={
            <AdminLayout>
              <JobManagement />
            </AdminLayout>
          } />
          <Route path="/admin/posts" element={
            <AdminLayout>
              <PostManagement />
            </AdminLayout>
          } />
          <Route path="/admin/events" element={
            <AdminLayout>
              <EventManagement />
            </AdminLayout>
          } />
          <Route path="/admin/content" element={
            <AdminLayout>
              <ContentModeration />
            </AdminLayout>
          } />
          <Route path="/admin/analytics" element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          } />
          <Route path="/admin/notifications" element={
            <AdminLayout>
              <AdminNotifications />
            </AdminLayout>
          } />
          <Route path="/admin/settings" element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          } />
          <Route
            path="/admin/posts/:postId"
            element={(
              <AdminLayout>
                <AdminPostDetail />
              </AdminLayout>
            )}
          />
          <Route
            path="/admin/tickets"
            element={
              <AdminLayout>
                <AdminTicketManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/tickets/:ticketId"
            element={
              <AdminLayout>
                <AdminTicketDetail />
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/ticket/:ticketId"
            element={(
              <AdminLayout>
                <AdminTicketDetail />
              </AdminLayout>
            )}
          />
          <Route 
            path="/admin/jobs/:jobId"
            element={(
              <AdminLayout>
                <AdminJobDetail />
              </AdminLayout>
            )}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
