import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Button, Avatar, Paper,
  TextField, InputAdornment, IconButton, Menu, MenuItem, Snackbar, Alert, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, Search, MoreVert, ThumbUp, Close, Edit, Delete, PhotoCamera, PushPin, PushPinOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'general', priority: 'medium', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewAnnouncement, setViewAnnouncement] = useState(null);

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
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, categoryFilter]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setFilteredAnnouncements(response.data);
      setPinnedAnnouncements(response.data.filter(a => a.pinnedBy?.includes(user?.id)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, announcement) => {
    setMenuAnchor(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleMenuClose = () => { setMenuAnchor(null); setSelectedAnnouncement(null); };

  const handleLike = async (announcementId) => {
    try {
      const response = await api.post(`/announcements/${announcementId}/like`);
      setAnnouncements(prev => prev.map(a =>
        a._id === announcementId ? { ...a, likes: response.data.announcement.likes || [] } : a
      ));
    } catch (error) {
      if (error.response?.status === 400) {
        setSnackbar({ open: true, message: 'You have already reacted to this announcement', severity: 'warning' });
      } else {
        console.error('Like error:', error);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleAddNew = () => {
    setFormData({ title: '', content: '', category: 'general', priority: 'medium', image: null });
    setImagePreview(null);
    setIsEditing(false);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = () => {
    setFormData({
      title: selectedAnnouncement.title,
      content: selectedAnnouncement.content,
      category: selectedAnnouncement.category,
      priority: selectedAnnouncement.priority,
      image: null
    });
    if (selectedAnnouncement.image) setImagePreview(selectedAnnouncement.image);
    setEditingId(selectedAnnouncement._id);
    setIsEditing(true);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/announcements/${selectedAnnouncement._id}`);
      setSnackbar({ open: true, message: 'Announcement deleted successfully!', severity: 'success' });
      fetchAnnouncements();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete announcement', severity: 'error' });
    }
    handleMenuClose();
  };

  const handlePin = async (announcement = null) => {
    try {
      const targetAnnouncement = announcement || selectedAnnouncement;
      const response = await api.patch(`/announcements/${targetAnnouncement._id}/pin`);
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      fetchAnnouncements();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update pin status', severity: 'error' });
    }
    if (!announcement) handleMenuClose();
  };

  const handleViewPost = (announcement) => {
    setViewAnnouncement(announcement);
    setViewDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let imageUrl = imagePreview;
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);
        const uploadResponse = await api.post('/upload/announcement-image', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        priority: formData.priority
      };
      if (imageUrl) submitData.image = imageUrl;

      if (isEditing) {
        await api.put(`/announcements/${editingId}`, submitData);
        setSnackbar({ open: true, message: 'Announcement updated successfully!', severity: 'success' });
      } else {
        await api.post('/announcements', submitData);
        setSnackbar({ open: true, message: 'Announcement created successfully!', severity: 'success' });
      }

      setDialogOpen(false);
      setFormData({ title: '', content: '', category: 'general', priority: 'medium', image: null });
      setImagePreview(null);
      setIsEditing(false);
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} announcement`;
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const categories = ['All', 'Academic', 'Event', 'General', 'Urgent'];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', p: { xs: 1, sm: 2, md: 3 }, gap: { xs: 2, md: 3 } }}>

      {/* Left Sidebar */}
      <Paper sx={{ width: { xs: '100%', md: 320 }, p: 2, borderRadius: 2, mb: { xs: 2, md: 0 }, boxShadow: '0 6px 20px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Category</Typography>
        {categories.map(cat => (
          <Button
            key={cat}
            onClick={() => setCategoryFilter(cat.toLowerCase())}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              mb: 1,
              fontWeight: categoryFilter === cat.toLowerCase() ? 700 : 400,
              bgcolor: categoryFilter === cat.toLowerCase() ? 'black' : 'transparent',
              color: categoryFilter === cat.toLowerCase() ? 'white' : 'text.primary',
              '&:hover': { bgcolor: categoryFilter === cat.toLowerCase() ? '#333' : '#f5f5f5' }
            }}
          >
            {cat} ({cat === 'All' ? announcements.length : announcements.filter(a => a.category === cat.toLowerCase()).length})
          </Button>
        ))}
      </Paper>

      {/* Center Feed */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
        {/* Search & Create */}
        <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2, boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              fullWidth
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'black' }} /></InputAdornment> }}
            />
            {user?.role === 'admin' && (
              <Button variant="contained" startIcon={<Add />} onClick={handleAddNew} sx={{ minWidth: { xs: '100%', sm: 'auto' }, px: 3, bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}>Add Announcement</Button>
            )}
          </Box>
        </Paper>

        {/* Announcements */}
        {filteredAnnouncements.map(a => (
          <Card key={a._id} sx={{ borderRadius: 2, boxShadow: '0 6px 20px rgba(0,0,0,0.05)', width: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
                  <Avatar src={a.authorId?.profileImage}>{!a.authorId?.profileImage && a.author[0]}</Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>{a.title}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>{a.authorId?.name || a.author} · {new Date(a.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={(e) => handleMenuOpen(e, a)} sx={{ mt: { xs: 1, sm: 0 } }}><MoreVert sx={{ color: 'black' }} /></IconButton>
              </Box>
              <Typography sx={{ mt: 1, wordBreak: 'break-word' }}>{a.content}</Typography>
              {a.image && <Box component="img" src={a.image} alt={a.title} sx={{ width: '100%', mt: 2, borderRadius: 1 }} />}
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Button 
                  startIcon={<ThumbUp />} 
                  size="small" 
                  onClick={() => handleLike(a._id)} 
                  disabled={a.likes?.some(id => id.toString() === user?.id)}
                  sx={{
                    color: a.likes?.some(id => id.toString() === user?.id) ? 'black' : 'text.secondary',
                    '&:hover': !a.likes?.some(id => id.toString() === user?.id) ? { bgcolor: '#eee', color: 'black' } : {},
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  {a.likes?.length || 0} React
                </Button>
                <Button size="small">View Full Post</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Right Pinned Panel */}
      <Paper sx={{ width: { xs: '100%', md: 380 }, p: 2, borderRadius: 2, mt: { xs: 2, md: 0 }, height: 'fit-content', boxShadow: '0 6px 20px rgba(0,0,0,0.05)', flexShrink: 0 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2,ml: 6.5 }}>Pinned Announcements</Typography>
        {pinnedAnnouncements.length > 0 ? pinnedAnnouncements.map(a => (
          <Box key={a._id} mb={2} sx={{ borderRadius: 2, p: 1.5, bgcolor: '#f5f5f5', position: 'relative' }}>
            <IconButton size="small" onClick={() => handlePin(a)} sx={{ position: 'absolute', top: 4, right: 4, p: 0.5 }}><Close fontSize="small" /></IconButton>
            <Typography fontWeight={700} sx={{ pr: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</Typography>
            <Typography variant="caption" color="text.secondary">{a.category}</Typography>
            <Typography sx={{ mt: 1 }} noWrap>{a.content}</Typography>
            <Button size="small" sx={{ mt: 1 }} onClick={() => handleViewPost(a)}>View post &gt;</Button>
          </Box>
        )) : (
          <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>No pinned announcements</Typography>
            <Typography variant="caption">Pin announcements to save them here</Typography>
          </Box>
        )}
      </Paper>

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handlePin()} sx={{ gap: 2 }}>
          {selectedAnnouncement?.pinnedBy?.includes(user?.id) ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
          {selectedAnnouncement?.pinnedBy?.includes(user?.id) ? 'Unpin' : 'Pin'}
        </MenuItem>
        {user?.role === 'admin' && (
          <>
            <MenuItem onClick={handleEdit} sx={{ gap: 2 }}><Edit fontSize="small" /> Edit</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ gap: 2, color: 'error.main' }}><Delete fontSize="small" /> Delete</MenuItem>
          </>
        )}
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} helperText="Title must be 5-100 characters" error={formData.title.length > 0 && formData.title.length < 5} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} helperText="Content must be 10-1000 characters" error={formData.content.length > 0 && formData.content.length < 10} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ddd', borderRadius: 2, p: 3, textAlign: 'center' }}>
                {imagePreview ? (
                  <Box>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" color="error" onClick={removeImage} startIcon={<Delete />}>Remove Image</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <PhotoCamera sx={{ fontSize: 48, color: '#ddd', mb: 2 }} />
                    <Typography>Drag & drop an image or click below</Typography>
                    <Button variant="contained" component="label" sx={{ mt: 1, bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}>Upload Image<input type="file" hidden accept="image/*" onChange={handleImageUpload} /></Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={uploading} sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>{isEditing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* View Announcement Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewAnnouncement?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary">{viewAnnouncement?.authorId?.name || viewAnnouncement?.author} · {new Date(viewAnnouncement?.createdAt).toLocaleDateString()}</Typography>
          <Typography sx={{ mt: 2 }}>{viewAnnouncement?.content}</Typography>
          {viewAnnouncement?.image && <Box component="img" src={viewAnnouncement.image} alt={viewAnnouncement.title} sx={{ width: '100%', mt: 2, borderRadius: 1 }} />}
        </DialogContent>
        <DialogActions><Button onClick={() => setViewDialogOpen(false)}>Close</Button></DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Announcements;
