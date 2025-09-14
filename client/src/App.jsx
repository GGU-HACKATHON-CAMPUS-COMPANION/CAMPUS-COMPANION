import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load components for better performance
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Home = lazy(() => import('./components/Home'));
const Announcements = lazy(() => import('./components/Announcements'));
const Timetable = lazy(() => import('./components/Timetable'));
const PersonalTimetable = lazy(() => import('./components/PersonalTimetable'));
const LostFound = lazy(() => import('./components/LostFound'));
const Profile = lazy(() => import('./components/Profile'));
const Settings = lazy(() => import('./components/Settings'));
const ContactSupport = lazy(() => import('./components/ContactSupport'));
const HelpCenter = lazy(() => import('./components/HelpCenter'));
const OurMission = lazy(() => import('./components/OurMission'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#568F87',
      light: '#7BA8A0',
      dark: '#064232',
    },
    secondary: {
      main: '#7BA8A0',
      light: '#A8C4C0',
      dark: '#568F87',
    },
    background: {
      default: '#F8FAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#064232',
      secondary: '#568F87',
    },
    success: {
      main: '#568F87',
      light: '#7BA8A0',
      dark: '#064232',
    },
    error: {
      main: '#D67B7D',
      light: '#E8989A',
      dark: '#C66B6E',
    },
    accent: {
      main: '#F5BABB',
      light: '#F8D0D1',
      dark: '#E8989A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.005em',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(86, 143, 135, 0.08), 0 1px 3px rgba(6, 66, 50, 0.1)',
          border: '1px solid rgba(86, 143, 135, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: '#FFFFFF',
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,250,0.5) 100%)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(86, 143, 135, 0.15), 0 4px 8px rgba(6, 66, 50, 0.1)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(86, 143, 135, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

// Loading component
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <Dashboard><Home /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute>
          <Dashboard><Announcements /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute>
          <Dashboard><Timetable /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/plans" element={
        <ProtectedRoute>
          <Dashboard><PersonalTimetable /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/lost-found" element={
        <ProtectedRoute>
          <Dashboard><LostFound /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Dashboard><Profile /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Dashboard><Settings /></Dashboard>
        </ProtectedRoute>
      } />
      <Route path="contact-support" element={
        <ProtectedRoute>
          <ContactSupport/>
        </ProtectedRoute>
      } />
      <Route path="help-center" element={
        <ProtectedRoute>
          <HelpCenter/>
        </ProtectedRoute>
      } />
       <Route path="our-mission" element={
        <ProtectedRoute>
          <OurMission/>
        </ProtectedRoute>
      } />
      <Route path="Privacy-Policy" element={
        <ProtectedRoute>
          <PrivacyPolicy/>
        </ProtectedRoute>
      } />
      <Route path="terms-of-service" element={
        <ProtectedRoute>
          <TermsOfService/>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
