import { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, CircularProgress, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl,
  InputLabel, Select, MenuItem, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Timetable() {
  const [classes, setClasses] = useState([]);
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openClass, setOpenClass] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);
  const [classData, setClassData] = useState({ className: '', semester: 1 });
  const [timingData, setTimingData] = useState({ day: 'Monday', startTime: '', endTime: '', instructor: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimings = async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/timings`);
      setTimings(response.data);
    } catch (error) {
      console.error('Error fetching timings:', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/classes', classData);
      setOpenClass(false);
      setClassData({ className: '', semester: 1 });
      fetchClasses();
    } catch (error) {
      alert('Error creating class');
    }
  };

  const handleAddTiming = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/classes/${selectedClass._id}/timings`, timingData);
      setOpenTiming(false);
      setTimingData({ day: 'Monday', startTime: '', endTime: '', instructor: '' });
      fetchTimings(selectedClass._id);
    } catch (error) {
      alert('Error adding timing');
    }
  };

  const handleDeleteTiming = async (timingId) => {
    if (window.confirm('Delete this timing?')) {
      try {
        await api.delete(`/classes/timings/${timingId}`);
        fetchTimings(selectedClass._id);
      } catch (error) {
        console.error('Error deleting timing:', error);
      }
    }
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    fetchTimings(classItem._id);
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;

  if (selectedClass) {
    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button startIcon={<ArrowBack />} onClick={() => setSelectedClass(null)}>
            Back to Classes
          </Button>
          <Typography variant="h5">{selectedClass.className} - Semester {selectedClass.semester}</Typography>
          {user?.role === 'admin' && (
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenTiming(true)}>
              Add Timing
            </Button>
          )}
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Instructor</TableCell>
                {user?.role === 'admin' && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {timings.map((timing) => (
                <TableRow key={timing._id}>
                  <TableCell>{timing.day}</TableCell>
                  <TableCell>{timing.startTime} - {timing.endTime}</TableCell>
                  <TableCell>{timing.instructor}</TableCell>
                  {user?.role === 'admin' && (
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDeleteTiming(timing._id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openTiming} onClose={() => setOpenTiming(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Timing for {selectedClass.className}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleAddTiming} sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Day</InputLabel>
                <Select
                  value={timingData.day}
                  onChange={(e) => setTimingData({...timingData, day: e.target.value})}
                >
                  {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                fullWidth margin="normal" label="Start Time (HH:MM)" required
                value={timingData.startTime}
                onChange={(e) => setTimingData({...timingData, startTime: e.target.value})}
                placeholder="09:00"
              />
              <TextField
                fullWidth margin="normal" label="End Time (HH:MM)" required
                value={timingData.endTime}
                onChange={(e) => setTimingData({...timingData, endTime: e.target.value})}
                placeholder="10:30"
              />
              <TextField
                fullWidth margin="normal" label="Instructor Name" required
                value={timingData.instructor}
                onChange={(e) => setTimingData({...timingData, instructor: e.target.value})}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTiming(false)}>Cancel</Button>
            <Button onClick={handleAddTiming} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Classes</Typography>
        {user?.role === 'admin' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenClass(true)}>
            Add Class
          </Button>
        )}
      </Box>
      
      <Grid container spacing={2}>
        {classes.map((classItem) => (
          <Grid item xs={12} md={6} lg={4} key={classItem._id}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleClassClick(classItem)}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {classItem.className}
                </Typography>
                <Typography color="textSecondary">
                  Semester {classItem.semester}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openClass} onClose={() => setOpenClass(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateClass} sx={{ mt: 1 }}>
            <TextField
              fullWidth margin="normal" label="Class Name" required
              value={classData.className}
              onChange={(e) => setClassData({...classData, className: e.target.value})}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Semester</InputLabel>
              <Select
                value={classData.semester}
                onChange={(e) => setClassData({...classData, semester: e.target.value})}
              >
                {[1,2,3,4,5,6,7,8].map(sem => <MenuItem key={sem} value={sem}>{sem}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClass(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Timetable;