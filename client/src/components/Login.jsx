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

  // Glossy input style
  const glossyInputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      '& fieldset': { border: 'none' },
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
      '& input': { color: 'white', paddingTop: '20px' },
      '& textarea': { color: 'white' },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '4px',
      '&.Mui-focused': { color: 'white' },
      '&.MuiFormLabel-filled': { color: 'white' }
    },
    mb: 2 // spacing between fields
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url(/back-img.jpg)',
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
        background: 'rgba(0,0,0,0.4)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper elevation={24} sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{
                width: 80, height: 80, mx: 'auto', mb: 2,
                background: 'linear-gradient(45deg, #568F87, #064232)'
              }}>
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                fontWeight: 700,
                background: 'linear-gradient(45deg, #568F87, #064232)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Campus Companion
              </Typography>
              <Typography variant="body1" color="white" sx={{ mt: 1 }}>
                Your digital campus assistant
              </Typography>
            </Box>

            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(45deg, #568F87, #F5BABB)',
                  height: 3,
                  borderRadius: 2
                },
                '& .MuiTab-root': {
                  color: 'white !important',
                  '&.Mui-selected': { color: 'white !important' }
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
                      sx={glossyInputStyle}
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
                      sx={glossyInputStyle}
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
                sx={glossyInputStyle}
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={glossyInputStyle}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #568F87, #064232)',
                  '&:hover': { background: 'linear-gradient(45deg, #064232, #568F87)' },
                  fontWeight: 600,
                  fontSize: '1.1rem'
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
