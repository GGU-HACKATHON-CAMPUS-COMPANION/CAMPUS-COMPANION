import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Chip, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab, IconButton, Fab, InputAdornment,
  Avatar, Fade, Paper, Tooltip, CardMedia
} from '@mui/material';
import {
  Add, Delete, Edit, Search, LocationOn, Phone, AccessTime,
  Smartphone, MenuBook, Checkroom, Watch, Description, Category, PhotoCamera
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function LostFound() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: 'lost', title: '', description: '', category: '', location: '', contactInfo: '', image: '', imageFile: null
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items.filter(item =>
      tab === 0 ? item.type === 'lost' : item.type === 'found'
    );

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [items, tab, searchTerm, categoryFilter]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/lostfound');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imageFile" && value) {
          submitData.append("image", value);
        } else if (key !== "imageFile") {
          submitData.append(key, value);
        }
      });

      if (editingItem) {
        await api.put(`/lostfound/${editingItem._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/lostfound', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setOpen(false);
      setEditingItem(null);
      setFormData({
        type: 'lost', title: '', description: '', category: '', location: '', contactInfo: '', image: '', imageFile: null
      });
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error.response?.data || error);
      alert(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      contactInfo: item.contactInfo,
      image: item.image || '',
      imageFile: null
    });
    setOpen(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setFormData({ ...formData, image: imageUrl, imageFile: file });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await api.delete(`/lostfound/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/lostfound/${id}/status`, { status });
      fetchItems();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'active': return 'primary';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'electronics': return <Smartphone />;
      case 'books': return <MenuBook />;
      case 'clothing': return <Checkroom />;
      case 'accessories': return <Watch />;
      case 'documents': return <Description />;
      default: return <Category />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: '#3b82f6',
      books: '#f59e0b',
      clothing: '#ec4899',
      accessories: '#10b981',
      documents: '#6366f1',
      other: '#6b7280'
    };
    return colors[category] || colors.other;
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ position: 'relative', pb: 10, px: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Lost & Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Help reunite lost items with their owners
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search items..."
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
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="accessories">Accessories</MenuItem>
                  <MenuItem value="documents">Documents</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
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
                <Tab label="Lost" sx={{ fontWeight: 600 }} />
                <Tab label="Found" sx={{ fontWeight: 600 }} />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Items */}
      <Grid container spacing={3}>
        {filteredItems.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${item.type === 'lost' ? '#ef444420' : '#10b98120'}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }
                }}
              >
                {item.image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: getCategoryColor(item.category) }}>
                      {getCategoryIcon(item.category)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            bgcolor: item.type === 'lost' ? '#fee2e2' : '#d1fae5',
                            color: item.type === 'lost' ? '#ef4444' : '#10b981',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={item.status}
                          color={getStatusColor(item.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {item.description}
                  </Typography>

                  <Box flex={1} />

                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        {item.location}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        {item.contactInfo}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="primary.main">
                      By {item.userId?.name}
                    </Typography>
                  </Box>

                  {/* Edit/Delete buttons for owner and admin */}
                  {(user?._id === item.userId?._id || user?.role === 'admin') && (
                    <Box display="flex" gap={1} mt={2}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(item)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item._id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <Tooltip title="Post new item">
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 104,
            right: 24,
            background: 'black',
            '&:hover': { background: 'grey' },
            zIndex: 2000
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingItem(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Post Lost/Found Item'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="found">Found</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth margin="normal" label="Title" required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              fullWidth margin="normal" label="Description" multiline rows={3} required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
                <MenuItem value="documents">Documents</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth margin="normal" label="Location" required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <TextField
              fullWidth margin="normal" label="Contact Info" required
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            />

            {/* Image Upload */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Item Image (Optional)
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="item-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="item-image-upload">
                  <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ borderRadius: 2 }}>
                    Upload Image
                  </Button>
                </label>
                {formData.image && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setFormData({ ...formData, image: '', imageFile: null })}
                    sx={{ borderRadius: 2 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setEditingItem(null); }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingItem ? 'Update' : 'Post'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LostFound;
