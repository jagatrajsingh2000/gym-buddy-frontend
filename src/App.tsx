import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Login, Register, Dashboard, Workouts, Progress, Profile, Schedule, Settings, Chat, BodyMetrics } from './pages';
import TestAuth from './pages/TestAuth';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ClientWorkouts from './pages/workouts/ClientWorkouts';
import ClientDiet from './pages/diet/ClientDiet';
import TrainerDashboard from './pages/dashboard/TrainerDashboard';
import TrainerWorkouts from './pages/workouts/TrainerWorkouts';
import TrainerDiet from './pages/diet/TrainerDiet';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading while authentication is being restored
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </Box>
    );
  }
  
  // Only redirect to login after loading is complete and no user found
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main Layout Component
const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header user={user} onLogout={logout} onMobileMenuToggle={handleMobileMenuToggle} />
      <Sidebar mobileOpen={mobileMenuOpen} onMobileToggle={handleMobileMenuToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0.5, sm: 1 },
          mt: { xs: 5, sm: 6 },
          ml: { xs: 0, md: '220px' },
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'visible',
          width: { xs: '100%', md: 'calc(100% - 240px)' },
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
                       <Routes>
                 <Route path="/dashboard" element={
                   user?.userType === 'client' ? <ClientDashboard /> : 
                   user?.userType === 'trainer' ? <TrainerDashboard /> : 
                   <Dashboard />
                 } />
                 <Route path="/workouts" element={
                   user?.userType === 'client' ? <ClientWorkouts /> : 
                   user?.userType === 'trainer' ? <TrainerWorkouts /> : 
                   <Workouts />
                 } />
                 <Route path="/progress" element={<Progress />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/schedule" element={<Schedule />} />
                 <Route path="/chat" element={<Chat />} />
                 <Route path="/diet" element={
                   user?.userType === 'client' ? <ClientDiet /> : 
                   user?.userType === 'trainer' ? <TrainerDiet /> : 
                   <Navigate to="/dashboard" replace />
                 } />
                 <Route path="/body-metrics" element={<BodyMetrics />} />
                 <Route path="/test-auth" element={<TestAuth />} />
                 <Route path="/settings" element={<Settings />} />
                 <Route path="/" element={<Navigate to="/dashboard" replace />} />
               </Routes>
      </Box>
    </Box>
  );
};

// App Component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
