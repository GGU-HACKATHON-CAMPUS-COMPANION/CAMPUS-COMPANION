import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton, Tooltip, Chip, Avatar, Fade
} from '@mui/material';
import {
  Add, Delete, ArrowBack, Schedule, Class, School
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM – 8 PM

function Timetable() {
  const [classes, setClasses] = useState([]);
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openClass, setOpenClass] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);
  const [classData, setClassData] = useState({ className: '', semester: 1 });
  const [timingData, setTimingData] = useState({ subject: '', day: 'Monday', startTime: '', endTime: '', instructor: '' });
  const { user } = useAuth();

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try { 
      const res = await api.get('/classes'); 
      setClasses(res.data); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchTimings = async (classId) => {
    try {
      const res = await api.get(`/classes/${classId}/timings`);
      setTimings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try { 
      await api.post('/classes', classData); 
      setOpenClass(false); 
      setClassData({ className: '', semester: 1 }); 
      fetchClasses(); 
    } catch (err) { 
      alert('Error creating class'); 
    }
  };

  const handleAddTiming = async (e) => {
    e.preventDefault();
    try { 
      await api.post(`/classes/${selectedClass._id}/timings`, timingData);
      setOpenTiming(false); 
      setTimingData({ subject: '', day: 'Monday', startTime: '', endTime: '', instructor: '' }); 
      fetchTimings(selectedClass._id); 
    } catch (err) { 
      alert('Error adding timing'); 
    }
  };

  const handleDeleteTiming = async (timingId) => {
    if (!window.confirm('Delete this timing?')) return;
    try { 
      await api.delete(`/classes/timings/${timingId}`); 
      fetchTimings(selectedClass._id); 
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleClassClick = (classItem) => { 
    setSelectedClass(classItem); 
    fetchTimings(classItem._id); 
  };

  const getTopOffset = (time) => { 
    const [h, m] = time.split(':').map(Number); 
    return ((h - 8) * 50 + (m / 60) * 50); 
  };

  const getHeight = (start, end) => { 
    const [h1, m1] = start.split(':').map(Number); 
    const [h2, m2] = end.split(':').map(Number); 
    return ((h2*60+m2)-(h1*60+m1))*(50/60); 
  };
  
  const getSubjectColor = (subject) => {
    const colors = ['#568F87', '#F5BABB', '#E8989A', '#064232', '#7BA8A0', '#F8D0D1', '#D67B7D', '#568F87'];
    const hash = subject.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

  if (selectedClass) {
    return (
      <Box>
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button 
                startIcon={<ArrowBack />} 
                onClick={() => setSelectedClass(null)}
                sx={{ borderRadius: 2 }}
              >
                Back to Classes
              </Button>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedClass.className}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Semester {selectedClass.semester} Timetable
                </Typography>
              </Box>
            </Box>
            {user?.role === 'admin' && (
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => setOpenTiming(true)}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2563eb, #1d4ed8)'
                }}
              >
                Add Class
              </Button>
            )}
          </Box>
        </Box>

        {/* Timetable Grid */}
        <Box sx={{ overflowX: 'auto' }}>
          <Box display="grid" gridTemplateColumns="50px repeat(7, 1fr)" minWidth={700} border="1px solid #ccc">
            {/* Time Column */}
            <Box borderRight="1px solid #ccc">
              {hours.map(h => (
                <Box key={h} height={50} borderBottom="1px solid #eee" display="flex" alignItems="center" justifyContent="center" fontSize={{ xs: 10, sm: 12 }}>
                  {h <= 12 ? `${h} AM` : `${h-12} PM`}
                </Box>
              ))}
            </Box>

            {/* Day Columns */}
            {days.map(day => (
              <Box key={day} borderRight="1px solid #ccc" position="relative">
                <Box textAlign="center" fontWeight="bold" borderBottom="1px solid #ccc" p={0.5} fontSize={{ xs: 11, sm: 13 }}>{day}</Box>
                {hours.map((_, idx) => <Box key={idx} height={50} borderBottom="1px solid #eee" />)}

                {/* Timing blocks */}
                {timings.filter(t => t.day === day).map(t => (
                  <Tooltip 
                    key={t._id}
                    title={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {t.subject}
                        </Typography>
                        <Typography variant="body2">📍 {t.instructor}</Typography>
                        <Typography variant="body2">⏰ {t.startTime} - {t.endTime}</Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Box 
                      position="absolute" 
                      left={2} 
                      right={2} 
                      top={getTopOffset(t.startTime)} 
                      height={getHeight(t.startTime, t.endTime)}
                      sx={{
                        background: `linear-gradient(135deg, ${getSubjectColor(t.subject)}, ${getSubjectColor(t.subject)}dd)`,
                        color: 'white',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        fontSize: { xs: 10, sm: 12 },
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{t.subject}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>{t.startTime}-{t.endTime}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>{t.instructor}</Typography>
                      {user?.role === 'admin' && (
                        <IconButton 
                          size="small" 
                          sx={{ color: 'white', p: 0, mt: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }} 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTiming(t._id); }}
                        >
                          <Delete fontSize="small"/>
                        </IconButton>
                      )}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Add Timing Modal */}
        <Dialog open={openTiming} onClose={() => setOpenTiming(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Timing for {selectedClass.className}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleAddTiming} sx={{ mt: 1 }}>
              <TextField fullWidth margin="normal" label="Subject" required value={timingData.subject} onChange={e => setTimingData({...timingData, subject: e.target.value})} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Day</InputLabel>
                <Select value={timingData.day} onChange={e => setTimingData({...timingData, day: e.target.value})}>
                  {days.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth margin="normal" label="Start Time (HH:MM)" required value={timingData.startTime} onChange={e => setTimingData({...timingData, startTime: e.target.value})} />
              <TextField fullWidth margin="normal" label="End Time (HH:MM)" required value={timingData.endTime} onChange={e => setTimingData({...timingData, endTime: e.target.value})} />
              <TextField fullWidth margin="normal" label="Instructor" required value={timingData.instructor} onChange={e => setTimingData({...timingData, instructor: e.target.value})} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTiming(false)}>Cancel</Button>
            <Button onClick={handleAddTiming} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Class list view
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>Class Timetables</Typography>
          <Typography variant="body2" color="text.secondary">Select a class to view its schedule</Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => setOpenClass(true)}
            sx={{ borderRadius: 2, background: 'linear-gradient(45deg, #2563eb, #1d4ed8)' }}
          >
            Add Class
          </Button>
        )}
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {classes.map((classItem, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={classItem._id}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card 
                sx={{ cursor: 'pointer', borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}
                onClick={() => handleClassClick(classItem)}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ background: 'linear-gradient(45deg, #2563eb, #1d4ed8)' }}>
                      <Class />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{classItem.className}</Typography>
                      <Chip label={`Semester ${classItem.semester}`} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 600 }} />
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                    <Schedule sx={{ fontSize: 16 }} />
                    <Typography variant="body2">Click to view timetable</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {classes.length === 0 && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
          <School sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No classes available</Typography>
          <Typography variant="body2" color="text.disabled">Add a class to get started with timetables</Typography>
        </Box>
      )}

      {/* Add Class Modal */}
      <Dialog open={openClass} onClose={() => setOpenClass(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateClass} sx={{ mt: 1 }}>
            <TextField fullWidth margin="normal" label="Class Name" required value={classData.className} onChange={e => setClassData({...classData, className: e.target.value})} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Semester</InputLabel>
              <Select value={classData.semester} onChange={e => setClassData({...classData, semester: e.target.value})}>
                {[1,2,3,4,5,6,7,8].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClass(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Timetable;
