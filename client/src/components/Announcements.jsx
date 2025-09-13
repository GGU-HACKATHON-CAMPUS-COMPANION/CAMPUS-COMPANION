import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'general', priority: 'medium'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      setOpen(false);
      setFormData({
        title: '', content: '', category: 'general', priority: 'medium'
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert(error.response?.data?.message || 'Error posting announcement');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <>
      {user?.role === 'admin' && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Announcement
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {announcements.map((announcement) => (
          <Grid item xs={12} md={6} key={announcement._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" component="h2">
                    {announcement.title}
                  </Typography>
                  <Chip 
                    label={announcement.priority} 
                    color={getPriorityColor(announcement.priority)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {announcement.category} • By {announcement.author}
                </Typography>
                <Typography variant="body2">
                  {announcement.content}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Announcement</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth margin="normal" label="Title" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <TextField
              fullWidth margin="normal" label="Content" multiline rows={4} required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Post</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Announcements;