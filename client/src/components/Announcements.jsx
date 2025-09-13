import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton, Avatar, Fade, Skeleton
} from '@mui/material';
import {
  Add, Delete, Campaign, Event, School, Warning, Info, AccessTime
} from '@mui/icons-material';
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return <School />;
      case 'event': return <Event />;
      case 'urgent': return <Warning />;
      default: return <Campaign />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return '#2563eb';
      case 'event': return '#f59e0b';
      case 'urgent': return '#dc2626';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, md: 6 }} key={item}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="30%" height={16} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Campus Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated with the latest campus news and events
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
              }
            }}
          >
            Add Announcement
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {announcements.map((announcement, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={announcement._id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  },
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    height: 4, 
                    background: `linear-gradient(90deg, ${getCategoryColor(announcement.category)}, ${getCategoryColor(announcement.category)}80)` 
                  }} 
                />
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getCategoryColor(announcement.category),
                        width: 40,
                        height: 40
                      }}
                    >
                      {getCategoryIcon(announcement.category)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {announcement.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={announcement.category}
                          size="small"
                          sx={{ 
                            bgcolor: `${getCategoryColor(announcement.category)}20`,
                            color: getCategoryColor(announcement.category),
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                        <Chip 
                          label={announcement.priority} 
                          color={getPriorityColor(announcement.priority)}
                          size="small"
                          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      lineHeight: 1.6,
                      color: 'text.secondary'
                    }}
                  >
                    {announcement.content}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: 'text.secondary'
                    }}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600,
                      color: 'primary.main'
                    }}>
                      By {announcement.author}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
      
      {announcements.length === 0 && (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          py={8}
        >
          <Campaign sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No announcements yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Check back later for campus updates and news
          </Typography>
        </Box>
      )}

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Campaign />
          Create New Announcement
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth 
              margin="normal" 
              label="Announcement Title" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth 
              margin="normal" 
              label="Content" 
              multiline 
              rows={4} 
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="academic">📚 Academic</MenuItem>
                    <MenuItem value="event">🎉 Event</MenuItem>
                    <MenuItem value="general">📢 General</MenuItem>
                    <MenuItem value="urgent">⚠️ Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="low">🟢 Low</MenuItem>
                    <MenuItem value="medium">🟡 Medium</MenuItem>
                    <MenuItem value="high">🔴 High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(45deg, #2563eb, #1d4ed8)'
            }}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Announcements;