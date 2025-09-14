import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Chip, IconButton, Tooltip, Fab
} from '@mui/material';
import {
  Add, Delete, Event, Assignment, School, AccessTime
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function PersonalTimetable() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', type: 'class', day: 'Monday', startTime: '', endTime: '', location: '', notes: ''
  });
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...formData,
      userId: user.id
    };
    setEvents(prev => [...prev, newEvent]);
    setOpen(false);
    setFormData({
      title: '', type: 'class', day: 'Monday', startTime: '', endTime: '', location: '', notes: ''
    });
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getTypeColor = (type) => {
    const colors = {
      class: '#568F87',
      assignment: '#F5BABB',
      personal: '#7BA8A0',
      exam: '#E8989A'
    };
    return colors[type] || '#568F87';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'class': return <School />;
      case 'assignment': return <Assignment />;
      case 'personal': return <Event />;
      default: return <AccessTime />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            My Personal Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your classes, assignments, and personal events
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {days.map(day => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={day}>
            <Card sx={{ minHeight: { xs: 250, sm: 300 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  {day}
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {events
                    .filter(event => event.day === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(event => (
                      <Card key={event.id} sx={{ 
                        bgcolor: `${getTypeColor(event.type)}15`,
                        border: `1px solid ${getTypeColor(event.type)}30`
                      }}>
                        <CardContent sx={{ 
                          p: { xs: 1.5, sm: 2 }, 
                          '&:last-child': { pb: { xs: 1.5, sm: 2 } } 
                        }}>
                          <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                {getTypeIcon(event.type)}
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {event.title}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {event.startTime} - {event.endTime}
                              </Typography>
                              {event.location && (
                                <Typography variant="caption" color="text.secondary">
                                  📍 {event.location}
                                </Typography>
                              )}
                              <Box mt={1}>
                                <Chip 
                                  label={event.type}
                                  size="small"
                                  sx={{ 
                                    bgcolor: getTypeColor(event.type),
                                    color: 'white',
                                    textTransform: 'capitalize'
                                  }}
                                />
                              </Box>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(event.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  {events.filter(event => event.day === day).length === 0 && (
                    <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>
                      No events scheduled
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tooltip title="Add new event">
        <Fab
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 140, sm: 100 },
            left: { xs: 16, sm: 24 },
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid black',
            color: 'black',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <MenuItem value="class">📚 Class</MenuItem>
                <MenuItem value="assignment">📝 Assignment</MenuItem>
                <MenuItem value="personal">📅 Personal</MenuItem>
                <MenuItem value="exam">📊 Exam</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Day</InputLabel>
              <Select
                value={formData.day}
                onChange={(e) => setFormData({...formData, day: e.target.value})}
              >
                {days.map(day => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Start Time"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="End Time"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Notes"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Event</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalTimetable;