import { useState } from 'react';
import {
  Box, Paper, Avatar, Typography, Grid, TextField, Button, Divider,
  Card, CardContent, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, CircularProgress
} from '@mui/material';
import {
  Person, Email, School, Edit, Save, Cancel, Badge, Security, PhotoCamera, Delete
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
    address: user?.address || ''
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageUploading, setImageUploading] = useState(false);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', editData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to change password',
        severity: 'error'
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Image size should be less than 5MB', severity: 'error' });
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/upload/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSnackbar({ open: true, message: 'Profile image updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile image',
        severity: 'error'
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageRemove = async () => {
    try {
      const response = await api.put('/auth/profile', { ...editData, profileImage: null });
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSnackbar({ open: true, message: 'Profile image removed successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to remove profile image',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* Profile Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          backgroundColor: '#fff',
          color: '#111',
          position: 'relative',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '2.5rem',
                  border: '2px solid #ddd',
                  backgroundColor: '#eee'
                }}
              >
                {!user?.profileImage && <Person sx={{ fontSize: '3.5rem', color: '#888' }} />}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: -5, right: -5, display: 'flex', gap: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton component="span" size="small" sx={{ bgcolor: '#000', color: '#fff' }}>
                    {imageUploading ? <CircularProgress size={16} /> : <PhotoCamera fontSize="small" />}
                  </IconButton>
                </label>
                {user?.profileImage && (
                  <IconButton size="small" onClick={handleImageRemove} sx={{ bgcolor: '#000', color: '#fff' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {user?.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={user?.studentId} sx={{ bgcolor: '#eee', color: '#111' }} />
              <Chip label={user?.role === 'admin' ? 'Administrator' : 'Student'} sx={{ bgcolor: '#eee', color: '#111' }} />
            </Box>
          </Grid>
          <Grid item>
            <IconButton onClick={handleEdit} color="primary">
              <Edit />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Personal Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                {['name', 'email', 'studentId', 'phone', 'department', 'year', 'address'].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={editing ? editData[field] : user?.[field]}
                      onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                      disabled={!editing}
                      variant={editing ? 'outlined' : 'filled'}
                      sx={{
                        backgroundColor: editing ? '#fff' : '#f5f5f5',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {editing && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member Since
              </Typography>
              <Typography>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</Typography>
              <Divider sx={{ my: 2 }} />
              <Button fullWidth variant="outlined" startIcon={<Security />} onClick={() => setPasswordDialog(true)}>
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
