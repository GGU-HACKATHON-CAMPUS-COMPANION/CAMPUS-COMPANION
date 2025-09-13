import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
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
    try { const res = await api.get('/classes'); setClasses(res.data); } 
    catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchTimings = async (classId) => {
    try { const res = await api.get(`/classes/${classId}/timings`); setTimings(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try { await api.post('/classes', classData); setOpenClass(false); setClassData({ className: '', semester: 1 }); fetchClasses(); } 
    catch (err) { alert('Error creating class'); }
  };

  const handleAddTiming = async (e) => {
    e.preventDefault();
    try { await api.post(`/classes/${selectedClass._id}/timings`, timingData); setOpenTiming(false); setTimingData({ subject: '', day: 'Monday', startTime: '', endTime: '', instructor: '' }); fetchTimings(selectedClass._id); } 
    catch (err) { alert('Error adding timing'); }
  };

  const handleDeleteTiming = async (timingId) => {
    if (!window.confirm('Delete this timing?')) return;
    try { await api.delete(`/classes/timings/${timingId}`); fetchTimings(selectedClass._id); } 
    catch (err) { console.error(err); }
  };

  const handleClassClick = (classItem) => { setSelectedClass(classItem); fetchTimings(classItem._id); };

  const getTopOffset = (time) => { const [h, m] = time.split(':').map(Number); return ((h - 8) * 50 + (m / 60) * 50); };
  const getHeight = (start, end) => { const [h1, m1] = start.split(':').map(Number); const [h2, m2] = end.split(':').map(Number); return ((h2*60+m2)-(h1*60+m1))*(50/60); };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;

  if (selectedClass) {
    return (
      <Box>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} gap={1}>
          <Button startIcon={<ArrowBack />} onClick={() => setSelectedClass(null)}>Back</Button>
          <Typography variant="h5">{selectedClass.className} - Semester {selectedClass.semester}</Typography>
          {user?.role === 'admin' && <Button variant="contained" startIcon={<Add />} onClick={() => setOpenTiming(true)}>Add Timing</Button>}
        </Box>

        {/* Responsive Timetable Grid */}
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
                  <Box key={t._id} position="absolute" left={2} right={2} top={getTopOffset(t.startTime)} height={getHeight(t.startTime, t.endTime)}
                    bgcolor="#6366f1" color="white" borderRadius={1} px={0.5} fontSize={{ xs: 10, sm: 12 }} overflow="hidden">
                    <strong>{t.subject}</strong> <br /> {t.startTime}-{t.endTime} <br /> {t.instructor}
                    {user?.role === 'admin' && (
                      <IconButton size="small" sx={{ color: 'white', p: 0, mt: 0.5 }} onClick={() => handleDeleteTiming(t._id)}>
                        <Delete fontSize="small"/>
                      </IconButton>
                    )}
                  </Box>
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

  return (
    <Box>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} gap={1}>
        <Typography variant="h5">Classes</Typography>
        {user?.role === 'admin' && <Button variant="contained" startIcon={<Add />} onClick={() => setOpenClass(true)}>Add Class</Button>}
      </Box>

      <Grid container spacing={2}>
        {classes.map(classItem => (
          <Grid item xs={12} sm={6} md={4} key={classItem._id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleClassClick(classItem)}>
              <CardContent>
                <Typography variant="h6">{classItem.className}</Typography>
                <Typography color="textSecondary">Semester {classItem.semester}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
