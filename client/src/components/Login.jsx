import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, Tabs, Tab,
  InputAdornment, IconButton, Fade, Slide
} from '@mui/material';
import {
  Email, Lock, Person, Badge, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Floating animation keyframes
const floatAnimation = (x, y, duration) => ({
  animation: `float${x}${y} ${duration}s ease-in-out infinite alternate`,
  '@keyframes': {
    [`float${x}${y}`]: {
      '0%': { transform: `translate(${x}px, ${y}px)` },
      '100%': { transform: `translate(${x + (Math.random()*20-10)}px, ${y + (Math.random()*20-10)}px)` }
    }
  }
});

function Login() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', studentId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 0) await login(formData.email, formData.password);
      else await register(formData.name, formData.email, formData.password, formData.studentId);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const liquidInputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff',
      '& input': { color: 'white', fontWeight: 500 },
      '& fieldset': { border: 'none' },
      '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
      '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#fff' }
    },
    mb: 1.5
  };

  return (
    <Box sx={{
      
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://i.ytimg.com/vi/YRnxuoNX0Zs/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEYgZSg0MA8=&rs=AOn4CLB6q02xjs7AgtV516dLFUkrPOv41w')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center 0%',
  backgroundRepeat: 'no-repeat',
  zIndex: 0
}}>
      {/* Animated Background Elements */}
      

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <Slide direction="up" in mountOnEnter unmountOnExit>
          <Paper elevation={0} sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Campus Companion</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Your AI-powered campus assistant
            </Typography>

            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              centered
              sx={{
                mb: 2,
                '& .MuiTabs-indicator': { backgroundColor: '#fff' },
                '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 600, '&.Mui-selected': { color: '#fff' } }
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            <Box component="form" onSubmit={handleSubmit}>
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
                      fullWidth placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required
                      InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#fff' }} /></InputAdornment> }}
                      sx={liquidInputStyle}
                    />
                    <TextField
                      fullWidth placeholder="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required
                      InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#fff' }} /></InputAdornment> }}
                      sx={liquidInputStyle}
                    />
                  </Box>
                </Fade>
              )}

              <TextField
                fullWidth placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#fff' }} /></InputAdornment> }}
                sx={liquidInputStyle}
              />

              <TextField
                fullWidth placeholder="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#fff' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#fff' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={liquidInputStyle}
              />

              <Button
                type="submit" fullWidth variant="contained"
                sx={{ mt: 3, py: 1.5, borderRadius: 2, backgroundColor: '#fff', color: '#000', fontWeight: 700, '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
                disabled={loading}
              >
                {loading ? 'Processing...' : tab === 0 ? 'Sign In' : 'Create Account'}
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}

export default Login;
