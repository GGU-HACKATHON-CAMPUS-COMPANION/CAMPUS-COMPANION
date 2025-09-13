import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Chip, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab, IconButton, Fab, InputAdornment,
  Avatar, Fade, Paper, Tooltip
} from '@mui/material';
import {
  Add, Delete, Edit, Search, LocationOn, Phone, Person, AccessTime,
  Smartphone, MenuBook, Checkroom, Watch, Description, Category
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
  const [formData, setFormData] = useState({
    type: 'lost', title: '', description: '', category: '', location: '', contactInfo: ''
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
      await api.post('/lostfound', formData);
      setOpen(false);
      setFormData({
        type: 'lost', title: '', description: '', category: '', location: '', contactInfo: ''
      });
      fetchItems();
    } catch (error) {
      console.error('Error posting item:', error.response?.data || error);
      alert(error.response?.data?.message || 'Error posting item');
    }
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
      electronics: '#568F87',
      books: '#F5BABB',
      clothing: '#E8989A',
      accessories: '#064232',
      documents: '#568F87',
      other: '#064232'
    };
    return colors[category] || colors.other;
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ position: 'relative', pb: 10 }}>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Lost & Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Help reunite lost items with their owners
            </Typography>
          </Box>
        </Box>
        
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
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
                <InputLabel>Category</InputLabel>
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
                sx={{
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #2563eb, #f59e0b)',
                    height: 3,
                    borderRadius: 2
                  }
                }}
              >
                <Tab label="Lost Items" sx={{ fontWeight: 600 }} />
                <Tab label="Found Items" sx={{ fontWeight: 600 }} />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={item._id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                border: `2px solid ${item.type === 'lost' ? '#ef444420' : '#10b98120'}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <Box 
                  sx={{ 
                    height: 4, 
                    background: item.type === 'lost' 
                      ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
                      : 'linear-gradient(90deg, #10b981, #059669)'
                  }} 
                />
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getCategoryColor(item.category),
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 }
                      }}
                    >
                      {getCategoryIcon(item.category)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        {item.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={item.type}
                          size="small"
                          sx={{ 
                            bgcolor: item.type === 'lost' ? '#ef444420' : '#10b98120',
                            color: item.type === 'lost' ? '#ef4444' : '#10b981',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        />
                        <Chip 
                          label={item.status} 
                          color={getStatusColor(item.status)}
                          size="small"
                          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                    {(user?.role === 'admin' || item.userId?._id === user?.id) && (
                      <Tooltip title="Delete item">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(item._id)} 
                          color="error"
                          sx={{ '&:hover': { bgcolor: '#ef444420' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ mb: 2, lineHeight: 1.6, color: 'text.secondary' }}
                  >
                    {item.description}
                  </Typography>
                  
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
                    <Typography variant="caption" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      color: 'text.secondary'
                    }}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600,
                      color: 'primary.main'
                    }}>
                      By {item.userId?.name}
                    </Typography>
                  </Box>
                  
                  {(user?.role === 'admin' || item.userId?._id === user?.id) && item.status === 'active' && (
                    <Button 
                      size="small" 
                      variant="contained"
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)',
                        }
                      }}
                      onClick={() => handleStatusUpdate(item._id, 'resolved')}
                    >
                      Mark as Resolved
                    </Button>
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
            bottom: { xs: 80, sm: 24 },
            left: { xs: 16, sm: 24 },
            background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
            },
            boxShadow: '0 8px 25px rgba(86, 143, 135, 0.3)'
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post Lost/Found Item</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="found">Found</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth margin="normal" label="Title" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <TextField
              fullWidth margin="normal" label="Description" multiline rows={3} required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
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
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <TextField
              fullWidth margin="normal" label="Contact Info" required
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LostFound;