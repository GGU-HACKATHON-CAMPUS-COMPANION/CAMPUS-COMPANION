import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Chip, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Tabs, Tab, IconButton
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    type: 'lost', title: '', description: '', category: '', location: '', contactInfo: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

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

  const filteredItems = items.filter(item => 
    tab === 0 ? item.type === 'lost' : item.type === 'found'
  );

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Lost Items" />
          <Tab label="Found Items" />
        </Tabs>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Post Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={item.status} 
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                    {(user?.role === 'admin' || item.userId?._id === user?.id) && (
                      <IconButton size="small" onClick={() => handleDelete(item._id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {item.category} • {item.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact: {item.contactInfo}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Posted by {item.userId?.name} on {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
                {(user?.role === 'admin' || item.userId?._id === user?.id) && item.status === 'active' && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ mt: 1 }}
                    onClick={() => handleStatusUpdate(item._id, 'resolved')}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
    </>
  );
}

export default LostFound;