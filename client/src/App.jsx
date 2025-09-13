import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

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

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
