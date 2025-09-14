import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, Tabs, Tab,
  Avatar, InputAdornment, IconButton, Fade, Slide
} from '@mui/material';
import {
  School, Email, Lock, Person, Badge, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', studentId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 0) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.studentId);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Liquid crystal input style
  const liquidInputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      backgroundColor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '2px solid rgba(255,255,255,0.3)',
      transition: 'all 0.2s ease',
      '& fieldset': { border: 'none' },
      '&:hover': { 
        backgroundColor: 'rgba(255,255,255,0.15)',
        border: '2px solid rgba(255,255,255,0.4)'
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.6)',
        boxShadow: '0 0 0 2px rgba(255,255,255,0.2)'
      },
      '& input': { 
        color: 'white', 
        fontSize: { xs: '0.9rem', sm: '1rem' },
        '&::placeholder': { color: 'rgba(255,255,255,0.6)' }
      },
      '& textarea': { color: 'white' },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'rgba(255,255,255,0.7)'
    },
    mb: 1.5
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url("https://images.pexels.com/photos/31938134/pexels-photo-31938134.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      py: { xs: 2, sm: 4 },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper elevation={0} sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 0,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{
                width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 }, mx: 'auto', mb: 1.5,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <School sx={{ fontSize: { xs: 35, sm: 40 }, color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 800,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.5px'
              }}>
                CAMPUS COMPANION
              </Typography>
              <Typography variant="body2" sx={{ 
                mt: 0.5, 
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 500
              }}>
                Your AI-powered campus assistant
              </Typography>
            </Box>

            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              centered
              sx={{
                mb: 2,
                '& .MuiTabs-indicator': {
                  background: 'rgba(255,255,255,0.8)',
                  height: 4,
                  borderRadius: 0
                },
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7) !important',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  '&.Mui-selected': { 
                    color: 'white !important',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  },
                  '&:hover': {
                    color: 'rgba(255,255,255,0.9) !important'
                  }
                }
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {error && (
                <Fade in={!!error}>
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {tab === 1 && (
                <Fade in={tab === 1}>
                  <Box>
                    <TextField
                      fullWidth
                      margin="normal"
                      name="name"
                      placeholder='Full Name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Person color="primary" /></InputAdornment>,
                      }}
                      sx={liquidInputStyle}
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      name="studentId"
                      placeholder='Student ID'
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Badge color="primary" /></InputAdornment>,
                      }}
                      sx={liquidInputStyle}
                    />
                  </Box>
                </Fade>
              )}

              <TextField
                fullWidth
                margin="normal"
                name="email"
                type="email"
                placeholder='Email Address'
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="primary" /></InputAdornment>,
                }}
                sx={liquidInputStyle}
              />

              <TextField
                fullWidth
                margin="normal"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder='Password'
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="primary" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={liquidInputStyle}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: 0,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.3)',
                    border: '2px solid rgba(255,255,255,0.6)'
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {loading ? 'Processing...' : (tab === 0 ? 'Sign In' : 'Create Account')}
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}

export default Login;
