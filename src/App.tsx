import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
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
import Reels from '@/pages/Reels';
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
import Tickets from '@/pages/Tickets';

// Project Pages
import Projects from '@/pages/Projects';
import ProjectCreate from '@/pages/ProjectCreate';
import ProjectDetail from '@/pages/ProjectDetail';

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
import ManagePostsPage from '@/pages/manage/posts';
import ManageJobsPage from '@/pages/manage/jobs';
import ManageTalentDirectoryPage from '@/pages/manage/talent-directory';

// Guards
import PrivateRoute from '@/components/auth/PrivateRoute';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

const App = () => {
  return (
    <AuthProvider>
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
            <Route path="/posts" element={
              <PrivateRoute>
                <AppLayout>
                  <Posts />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/reels" element={
              <PrivateRoute>
                <AppLayout>
                  <Reels />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/posts/:id" element={
              <PrivateRoute>
                <AppLayout>
                  <PostDetail />
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
            <Route path="/manage" element={
              <PrivateRoute>
                <AppLayout>
                  <ManagePage />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/manage/jobs" element={
              <PrivateRoute>
                <AppLayout>
                  <ManageJobsPage />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/manage/posts" element={
              <PrivateRoute>
                <AppLayout>
                  <ManagePostsPage />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/manage/jobs/:jobId" element={
              <PrivateRoute>
                <AppLayout>
                  <UserJobDetail />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/manage/posts/:postId" element={
              <PrivateRoute>
                <AppLayout>
                  <UserPostDetail />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/manage/talent-directory" element={
              <PrivateRoute>
                <AppLayout>
                  <ManageTalentDirectoryPage />
                </AppLayout>
              </PrivateRoute>
            } />

            {/* Collaborate Routes */}
            <Route path="/collaborate" element={
              <PrivateRoute>
                <AppLayout>
                  <Projects />
                </AppLayout>
              </PrivateRoute>
            } />
            <Route path="/collaborate/:projectId" element={
              <PrivateRoute>
                <AppLayout>
                  <ProjectDetail />
                </AppLayout>
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/superadmin-signup" element={<SuperAdminSignup />} />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute>
                  <AdminRouteGuard>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRouteGuard>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/profile" 
              element={
                <PrivateRoute>
                  <AdminRouteGuard requiredModule="team" requiredAction="view">
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </AdminRouteGuard>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/team" 
              element={
                <PrivateRoute>
                  <AdminRouteGuard requiredModule="team" requiredAction="view">
                    <AdminLayout>
                      <TeamManagement />
                    </AdminLayout>
                  </AdminRouteGuard>
                </PrivateRoute>
              } 
            />
            <Route path="/admin/users" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="users" requiredAction="view">
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/jobs" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="jobs" requiredAction="view">
                  <AdminLayout>
                    <JobManagement />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/posts" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="posts" requiredAction="view">
                  <AdminLayout>
                    <PostManagement />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/events" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="events" requiredAction="view">
                  <AdminLayout>
                    <EventManagement />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/content" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="content" requiredAction="view">
                  <AdminLayout>
                    <ContentModeration />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/analytics" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="content" requiredAction="view">
                  <AdminLayout>
                    <Analytics />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/notifications" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="team" requiredAction="view">
                  <AdminLayout>
                    <AdminNotifications />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />
            <Route path="/admin/settings" element={
              <PrivateRoute>
                <AdminRouteGuard requiredModule="team" requiredAction="view">
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </AdminRouteGuard>
              </PrivateRoute>
            } />

            {/* Admin Post Detail Route */}
            <Route
              path="/admin/posts/:postId"
              element={(
                <AdminLayout>
                  <AdminPostDetail />
                </AdminLayout>
              )}
            />

            {/* Admin Ticket Management Route */}
            <Route
              path="/admin/tickets"
              element={
                <PrivateRoute>
                  <AdminRouteGuard>
                    <AdminLayout>
                      <AdminTicketManagement />
                    </AdminLayout>
                  </AdminRouteGuard>
                </PrivateRoute>
              }
            />

            {/* Admin Ticket Detail Route */}
            <Route
              path="/admin/tickets/:ticketId"
              element={
                <PrivateRoute>
                  <AdminRouteGuard>
                    <AdminLayout>
                      <AdminTicketDetail />
                    </AdminLayout>
                  </AdminRouteGuard>
                </PrivateRoute>
              }
            />

            {/* Admin Job Detail Route */}
            <Route 
              path="/admin/ticket/:ticketId"
              element={(
                <AdminRouteGuard requiredModule="tickets" requiredAction="view">
                  <AdminLayout>
                    <AdminTicketDetail />
                  </AdminLayout>
                </AdminRouteGuard>
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

            {/* New Protected Route */}
            <Route path="/industry-hub" element={
              <PrivateRoute>
                <AppLayout>
                  <IndustryHub />
                </AppLayout>
              </PrivateRoute>
            } />

            <Route path="/tickets" element={
              <PrivateRoute>
                <AppLayout>
                  <Tickets />
                </AppLayout>
              </PrivateRoute>
            } />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
