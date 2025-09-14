import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Fab,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  Delete,
  Event,
  Assignment,
  School,
  AccessTime,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const STORAGE_KEY = "personal_timetable";

function PersonalTimetable() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "class",
    day: "Monday",
    startTime: "",
    endTime: "",
    location: "",
    notes: "",
  });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Load from localStorage with expiry
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { data, expiry } = JSON.parse(saved);
      if (Date.now() < expiry) {
        setEvents(data);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ✅ Save to localStorage with 9-day expiry
  useEffect(() => {
    const expiry = Date.now() + 9 * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: events, expiry }));
  }, [events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...formData,
      userId: user?.id || "guest",
    };
    console.log('Adding new event:', newEvent);
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      console.log('Updated events:', updated);
      return updated;
    });
    setOpen(false);
    setFormData({
      title: "",
      type: "class",
      day: "Monday",
      startTime: "",
      endTime: "",
      location: "",
      notes: "",
    });
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const getTypeColor = (type) => {
    const colors = {
      class: "#2563eb",
      assignment: "#f59e0b",
      personal: "#10b981",
      exam: "#ef4444",
    };
    return colors[type] || "#6b7280";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "class":
        return <School fontSize="small" />;
      case "assignment":
        return <Assignment fontSize="small" />;
      case "personal":
        return <Event fontSize="small" />;
      default:
        return <AccessTime fontSize="small" />;
    }
  };

  // ✅ Time slots for calendar view
  const timeSlots = Array.from({ length: 15 }, (_, i) => `${8 + i}:00`);
  
  // Debug: Log current events
  console.log('Current events:', events);

  return (
    <Box className='p-[2%]'>
      <Box mb={3}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ fontWeight: 700, color: "text.primary" }}
          align={isMobile ? "center" : "left"}
        >
          Weekly Schedule
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align={isMobile ? "center" : "left"}
        >
          A modern weekly calendar for your classes, assignments & personal events
        </Typography>
      </Box>

      {/* ✅ Responsive scrollable calendar */}
      <Box
        sx={{
          overflowX: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "80px repeat(7, minmax(140px, 1fr))",
            minWidth: "900px", // forces horizontal scroll on small screens
          }}
        >
          {/* Header row */}
          <Box />
          {days.map((day) => (
            <Box
              key={day}
              sx={{
                p: { xs: 0.5, sm: 1 },
                borderLeft: "1px solid #e5e7eb",
                textAlign: "center",
                bgcolor: "#f9fafb",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
              }}
            >
              {day}
            </Box>
          ))}

          {/* Time slots with events */}
          {timeSlots.map((time) => (
            <React.Fragment key={`time-${time}`}>
              {/* Time label */}
              <Box
                sx={{
                  borderTop: "1px solid #e5e7eb",
                  p: 0.5,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  textAlign: "right",
                }}
              >
                {time}
              </Box>

              {/* Events per day */}
              {days.map((day) => (
                <Box
                  key={`${day}-${time}`}
                  sx={{
                    borderTop: "1px solid #e5e7eb",
                    borderLeft: "1px solid #e5e7eb",
                    minHeight: { xs: 40, sm: 50 },
                    p: 0.5,
                  }}
                >
                  {events
                    .filter((e) => {
                      if (!e.startTime) return false;
                      const eventStartHour = parseInt(e.startTime.split(':')[0]);
                      const slotHour = parseInt(time.split(':')[0]);
                      const matches = e.day === day && eventStartHour === slotHour;
                      console.log(`Checking: ${e.title} - Day: ${e.day}===${day}, Hour: ${eventStartHour}===${slotHour}, Match: ${matches}`);
                      return matches;
                    })
                    .map((event) => (
                      <Card
                        key={event.id}
                        sx={{
                          bgcolor: `${getTypeColor(event.type)}22`,
                          borderLeft: `4px solid ${getTypeColor(event.type)}`,
                          mb: 0.5,
                          boxShadow: "none",
                        }}
                      >
                        <CardContent sx={{ p: 1 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={0.5}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                }}
                              >
                                {getTypeIcon(event.type)} {event.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {event.startTime} - {event.endTime}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(event.id)}
                              sx={{ color: "error.main" }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Add button */}
      <Tooltip title="Add new event">
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: { xs: 80, sm: 104 },
            right: { xs: 16, sm: 24 },
            boxShadow: 3,
            background:'black',
            '&:hover': { background: 'grey' },
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Dialog form */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
              >
                {days.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Start Time"
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="End Time"
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Notes"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalTimetable;
