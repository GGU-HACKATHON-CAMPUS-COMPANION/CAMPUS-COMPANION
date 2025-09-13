import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, Tabs, Tab
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', studentId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Campus Companion
        </Typography>
        
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {tab === 1 && (
            <>
              <TextField
                fullWidth margin="normal" name="name" label="Full Name"
                value={formData.name} onChange={handleChange} required
              />
              <TextField
                fullWidth margin="normal" name="studentId" label="Student ID"
                value={formData.studentId} onChange={handleChange} required
              />
            </>
          )}
          
          <TextField
            fullWidth margin="normal" name="email" type="email" label="Email"
            value={formData.email} onChange={handleChange} required
          />
          <TextField
            fullWidth margin="normal" name="password" type="password" label="Password"
            value={formData.password} onChange={handleChange} required
          />
          
          <Button
            type="submit" fullWidth variant="contained" sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Loading...' : (tab === 0 ? 'Login' : 'Register')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;