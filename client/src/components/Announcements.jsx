import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Chip, Box, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  FormControl, InputLabel, Select, MenuItem, IconButton, Avatar,
  Fade, Paper, Menu, Snackbar, Alert, InputAdornment, Tooltip
} from '@mui/material';
import {
  Add, Delete, Campaign, Event, School, Warning, AccessTime,
  Search, Clear, Edit, MoreVert
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
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general', priority: 'medium' });
  const [editingId, setEditingId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();

  useEffect(() => { fetchAnnouncements(); }, []);

  useEffect(() => {
    let filtered = announcements;
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') filtered = filtered.filter(a => a.category === categoryFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(a => a.priority === priorityFilter);
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, categoryFilter, priorityFilter]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setFilteredAnnouncements(response.data);
    } catch (error) {
      console.error(error);
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
      if (editingId) await api.put(`/announcements/${editingId}`, formData);
      else await api.post('/announcements', formData);

      setSnackbar({ open: true, message: editingId ? 'Updated successfully!' : 'Created successfully!', severity: 'success' });
      setOpen(false);
      setEditingId(null);
      setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
      fetchAnnouncements();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error', severity: 'error' });
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({ title: announcement.title, content: announcement.content, category: announcement.category, priority: announcement.priority });
    setOpen(true);
    setMenuAnchor(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setSnackbar({ open: true, message: 'Deleted successfully!', severity: 'success' });
      fetchAnnouncements();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error deleting', severity: 'error' });
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event, announcement) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => { setMenuAnchor(null); setSelectedAnnouncement(null); };

  const getPriorityColor = (priority) => ({ high: 'error', medium: 'warning', low: 'info' }[priority] || 'info');
  const getCategoryIcon = (category) => ({ academic: <School />, event: <Event />, urgent: <Warning /> }[category] || <Campaign />);
  const getCategoryColor = (category) => ({ academic: '#568F87', event: '#F5BABB', urgent: '#E8989A', general: '#064232' }[category] || '#064232');

  return (
    <Box width="100%">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Campus Announcements</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Stay updated with the latest campus news and events</Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}
            sx={{ 
              borderRadius: 2, 
              px: { xs: 2, sm: 3 }, 
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              background: 'linear-gradient(45deg,#568F87,#064232)', 
              '&:hover': { background: 'linear-gradient(45deg,#064232,#568F87)' } 
            }}>
            Add Announcement
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth placeholder="Search announcements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment>,
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <Select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)} 
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }} 
                displayEmpty
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <Select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)} 
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }} 
                displayEmpty
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Tooltip title="Clear all filters">
              <Button 
                variant="outlined" 
                onClick={clearFilters} 
                startIcon={<Clear />} 
                sx={{ 
                  borderRadius: 2, 
                  width: '100%',
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Clear
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Announcements */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {filteredAnnouncements.map((announcement, index) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={announcement._id}>
            <Fade in timeout={300 + index * 100}>
              <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
                <Box height={4} sx={{ background: `linear-gradient(90deg, ${getCategoryColor(announcement.category)}, ${getCategoryColor(announcement.category)}80)` }} />
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: getCategoryColor(announcement.category) }}>{getCategoryIcon(announcement.category)}</Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600} mb={0.5} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{announcement.title}</Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1}>
                          <Chip label={announcement.category} size="small" sx={{ bgcolor: `${getCategoryColor(announcement.category)}20`, color: getCategoryColor(announcement.category), fontWeight: 600, textTransform: 'capitalize' }} />
                          <Chip label={announcement.priority} size="small" color={getPriorityColor(announcement.priority)} sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
                        </Box>
                        {user?.role === 'admin' && (
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, announcement)}><MoreVert fontSize="small" /></IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{announcement.content}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}><AccessTime sx={{ fontSize: 14 }} />{new Date(announcement.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={600}>By {announcement.author}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* No announcements */}
      {filteredAnnouncements.length === 0 && !loading && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} textAlign="center">
          <Campaign sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">{announcements.length === 0 ? 'No announcements yet' : 'No announcements match your filters'}</Typography>
          <Typography variant="body2" color="text.disabled">{announcements.length === 0 ? 'Check back later for updates' : 'Try adjusting your search or filter criteria'}</Typography>
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, background: 'linear-gradient(135deg,#568F87 0%,#064232 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
          {editingId ? <Edit /> : <Campaign />}{editingId ? 'Edit Announcement' : 'Create New Announcement'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" margin="normal" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Content" margin="normal" multiline rows={4} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} sx={{ borderRadius: 2 }}>
                    <MenuItem value="academic">Academic</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} sx={{ borderRadius: 2 }}>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpen(false); setEditingId(null); setFormData({ title: '', content: '', category: 'general', priority: 'medium' }); }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, px: 3, background: 'linear-gradient(45deg,#568F87,#064232)' }}>{editingId ? 'Update' : 'Publish'}</Button>
        </DialogActions>
      </Dialog>

      {/* Admin Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 2, minWidth: 150, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
        <MenuItem onClick={() => handleEdit(selectedAnnouncement)} sx={{ gap: 2 }}><Edit fontSize="small" /> Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(selectedAnnouncement?._id)} sx={{ gap: 2, color: 'error.main' }}><Delete fontSize="small" /> Delete</MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Announcements;
