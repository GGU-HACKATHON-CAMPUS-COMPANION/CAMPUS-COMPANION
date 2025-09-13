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

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper elevation={24} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                background: 'linear-gradient(45deg, #2563eb, #f59e0b)'
              }}>
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2563eb, #f59e0b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Campus Companion
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Your digital campus assistant
              </Typography>
            </Box>
            <Tabs 
              value={tab} 
              onChange={(e, newValue) => setTab(newValue)} 
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(45deg, #2563eb, #f59e0b)',
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab label="Login" sx={{ fontWeight: 600, minWidth: 120 }} />
              <Tab label="Register" sx={{ fontWeight: 600, minWidth: 120 }} />
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
                      label="Full Name"
                      value={formData.name} 
                      onChange={handleChange} 
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      fullWidth 
                      margin="normal" 
                      name="studentId" 
                      label="Student ID"
                      value={formData.studentId} 
                      onChange={handleChange} 
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                </Fade>
              )}
          
              <TextField
                fullWidth 
                margin="normal" 
                name="email" 
                type="email" 
                label="Email Address"
                value={formData.email} 
                onChange={handleChange} 
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth 
                margin="normal" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                label="Password"
                value={formData.password} 
                onChange={handleChange} 
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
                  },
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