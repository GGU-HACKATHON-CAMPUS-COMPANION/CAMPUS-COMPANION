import { useState } from 'react';
import {
  Box, Paper, Avatar, Typography, Grid, TextField, Button, Divider,
  Card, CardContent, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, CircularProgress
} from '@mui/material';
import {
  Person, Email, School, Edit, Save, Cancel, AccountCircle,
  CalendarToday, Badge, Security, PhotoCamera, Delete
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    studentId: user?.studentId || ''
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageUploading, setImageUploading] = useState(false);

  const handleEdit = () => {
    setEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      studentId: user?.studentId || ''
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      studentId: user?.studentId || ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/profile', editData);
      const updatedUser = response.data.user;
      
      // Update localStorage and context
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
      const response = await api.put('/auth/profile', { 
        name: user?.name,
        email: user?.email, 
        studentId: user?.studentId,
        profileImage: null 
      });
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Profile Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #568F87 0%, #064232 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: -50, 
          right: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          bgcolor: 'rgba(245, 186, 187, 0.1)' 
        }} />
        
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={user?.profileImage}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  background: user?.profileImage ? 'transparent' : 'linear-gradient(45deg, #F5BABB, #E8989A)',
                  fontSize: '2.5rem',
                  border: '4px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                {!user?.profileImage && <Person sx={{ fontSize: '3.5rem' }} />}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: -8, right: -8, display: 'flex', gap: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    component="span"
                    size="small"
                    disabled={imageUploading}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: '#568F87',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    {imageUploading ? <CircularProgress size={16} /> : <PhotoCamera fontSize="small" />}
                  </IconButton>
                </label>
                {user?.profileImage && (
                  <IconButton
                    size="small"
                    onClick={handleImageRemove}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: '#E8989A',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<Badge />} 
                label={user?.studentId} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<School />} 
                label={user?.role === 'admin' ? 'Administrator' : 'Student'} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item>
            <IconButton 
              onClick={handleEdit}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <Edit />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #F5BABB' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountCircle sx={{ mr: 2, color: '#568F87' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={editing ? editData.name : user?.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: '#568F87' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={editing ? editData.email : user?.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: '#568F87' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Student ID"
                    value={editing ? editData.studentId : user?.studentId}
                    onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                    disabled={!editing}
                    variant={editing ? "outlined" : "filled"}
                    InputProps={{
                      startAdornment: <Badge sx={{ mr: 1, color: '#568F87' }} />
                    }}
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{ borderColor: '#F5BABB', color: '#568F87' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ 
                      background: 'linear-gradient(45deg, #568F87, #F5BABB)',
                      '&:hover': { background: 'linear-gradient(45deg, #064232, #E8989A)' }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Details */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #F5BABB', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: '#568F87' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Account Details
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user?.updatedAt ? formatDate(user.updatedAt) : 'N/A'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Security />}
                onClick={() => setPasswordDialog(true)}
                sx={{ 
                  borderColor: '#F5BABB', 
                  color: '#568F87',
                  '&:hover': { borderColor: '#568F87', bgcolor: 'rgba(86, 143, 135, 0.04)' }
                }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #568F87, #F5BABB)',
              '&:hover': { background: 'linear-gradient(45deg, #064232, #E8989A)' }
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}

export default Profile;