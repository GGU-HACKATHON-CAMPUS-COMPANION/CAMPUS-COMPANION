import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton, Avatar, Fade, Skeleton, InputAdornment,
  ToggleButton, ToggleButtonGroup, Tooltip, Paper, Menu, Snackbar, Alert
} from '@mui/material';
import {
  Add, Delete, Campaign, Event, School, Warning, Info, AccessTime, Search,
  FilterList, Clear, Edit, MoreVert
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'general', priority: 'medium'
  });
  const [editingId, setEditingId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  useEffect(() => {
    let filtered = announcements;
    
    if (searchTerm) {
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.category === categoryFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }
    
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, categoryFilter, priorityFilter]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setFilteredAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/announcements/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Announcement updated successfully!', severity: 'success' });
      } else {
        await api.post('/announcements', formData);
        setSnackbar({ open: true, message: 'Announcement created successfully!', severity: 'success' });
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        title: '', content: '', category: 'general', priority: 'medium'
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error with announcement:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error with announcement', 
        severity: 'error' 
      });
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority
    });
    setOpen(true);
    setMenuAnchor(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        setSnackbar({ open: true, message: 'Announcement deleted successfully!', severity: 'success' });
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        setSnackbar({ 
          open: true, 
          message: error.response?.data?.message || 'Error deleting announcement', 
          severity: 'error' 
        });
      }
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event, announcement) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedAnnouncement(null);
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
      case 'academic': return '#568F87';
      case 'event': return '#F5BABB';
      case 'urgent': return '#E8989A';
      default: return '#064232';
    }
  };

  if (loading) {
    return (
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={item}>
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
      <Box mb={4}>
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
                background: 'linear-gradient(45deg, #568F87, #064232)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #064232, #568F87)',
                }
              }}
            >
              Add Announcement
            </Button>
          )}
        </Box>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Tooltip title="Clear all filters">
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<Clear />}
                  sx={{ borderRadius: 2, height: 56 }}
                >
                  Clear
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {filteredAnnouncements.map((announcement, index) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={announcement._id}>
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
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
                      <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
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
                        {user?.role === 'admin' && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, announcement)}
                            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        )}
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
      
      {filteredAnnouncements.length === 0 && !loading && (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          py={8}
        >
          <Campaign sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {announcements.length === 0 ? 'No announcements yet' : 'No announcements match your filters'}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {announcements.length === 0 ? 'Check back later for campus updates and news' : 'Try adjusting your search or filter criteria'}
          </Typography>
        </Box>
      )}
      
      {announcements.length === 0 && loading && (
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
          background: 'linear-gradient(135deg, #568F87 0%, #064232 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {editingId ? <Edit /> : <Campaign />}
          {editingId ? 'Edit Announcement' : 'Create New Announcement'}
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
            onClick={() => {
              setOpen(false);
              setEditingId(null);
              setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
            }}
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
              background: 'linear-gradient(45deg, #568F87, #064232)'
            }}
          >
            {editingId ? 'Update' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem 
          onClick={() => handleEdit(selectedAnnouncement)}
          sx={{ gap: 2 }}
        >
          <Edit fontSize="small" color="primary" />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(selectedAnnouncement?._id)}
          sx={{ gap: 2, color: 'error.main' }}
        >
          <Delete fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Announcements;