import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Button, TextField, Grid,
  Chip, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Edit, School, Email, Badge, Phone, LocationOn, CalendarToday, Save, Cancel
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    year: '3rd Year',
    address: '123 Campus Drive, University City'
  });

  const handleSave = () => {
    // Save logic here
    setEditing(false);
  };

  const stats = [
    { label: 'Classes Enrolled', value: '6', color: '#568F87' },
    { label: 'Assignments Due', value: '3', color: '#F5BABB' },
    { label: 'Lost Items Posted', value: '1', color: '#E8989A' },
    { label: 'Items Found', value: '2', color: '#7BA8A0' }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          My Profile
        </Typography>
        <Button
          variant={editing ? "outlined" : "contained"}
          startIcon={editing ? <Cancel /> : <Edit />}
          onClick={() => setEditing(!editing)}
          sx={{
            borderRadius: 2,
            background: editing ? 'transparent' : 'linear-gradient(45deg, #568F87, #064232)'
          }}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(45deg, #568F87, #064232)',
                fontSize: { xs: '2rem', sm: '2.5rem' }
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              {formData.name}
            </Typography>
            <Chip
              label={user?.studentId}
              sx={{
                bgcolor: '#568F8720',
                color: '#568F87',
                fontWeight: 600,
                mb: 2
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {formData.department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.year}
            </Typography>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <School color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    {editing ? (
                      <TextField
                        size="small"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Email color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    {editing ? (
                      <TextField
                        size="small"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Phone color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    {editing ? (
                      <TextField
                        size="small"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Badge color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Department
                    </Typography>
                    {editing ? (
                      <TextField
                        size="small"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.department}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOn color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    {editing ? (
                      <TextField
                        size="small"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formData.address}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {editing && (
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #568F87, #064232)'
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Activity Overview
          </Typography>
          <Grid container spacing={2}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: stat.color,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;