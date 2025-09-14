import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

function Timetable() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openClass, setOpenClass] = useState(false);
  const [openTiming, setOpenTiming] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classData, setClassData] = useState({ className: "", semester: 1 });
  const [timingData, setTimingData] = useState({
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    instructor: "",
  });

  const { user } = useAuth();
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/timetables/classes");
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClass(res.data[0]);
        fetchTimings(res.data[0]._id, res.data[0].className);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimings = async (classId, className) => {
    try {
      const res = await api.get(`/timetables/classes/${classId}/timings`);
      const mappedEvents = res.data.map((t) => {
        const startTime =
          t.startTime.includes(":")
            ? t.startTime.length === 5
              ? `${t.startTime}:00`
              : t.startTime
            : `${t.startTime}:00:00`;
        const endTime =
          t.endTime.includes(":")
            ? t.endTime.length === 5
              ? `${t.endTime}:00`
              : t.endTime
            : `${t.endTime}:00:00`;
        return {
          id: t._id,
          title: `${t.subject} — ${t.instructor}`,
          start: `${t.date}T${startTime}`,
          end: `${t.date}T${endTime}`,
          backgroundColor: t.subject === "PYTHON" ? "#3788d8" : t.subject === "JAVA(OOPS)" ? "#ca4756" : "#ff5722",
          borderColor: t.subject === "PYTHON" ? "#3788d8" : t.subject === "JAVA(OOPS)" ? "#ca4756" : "#ff5722",

          textColor: "#fff",
          extendedProps: {
            subject: t.subject,
            instructor: t.instructor,
            className,
          },
        };
      });
      setEvents(mappedEvents);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetables/classes", classData);
      setOpenClass(false);
      setClassData({ className: "", semester: 1 });
      fetchClasses();
    } catch (err) {
      alert("Error creating class");
    }
  };

  const handleAddTiming = async (e) => {
    e.preventDefault();
    try {
      const dateObj = new Date(timingData.date);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      const timingPayload = { ...timingData, day: dayName };
      await api.post(
        `/timetables/classes/${selectedClass._id}/timings`,
        timingPayload
      );

      setOpenTiming(false);
      setTimingData({
        subject: "",
        date: "",
        startTime: "",
        endTime: "",
        instructor: "",
      });
      fetchTimings(selectedClass._id, selectedClass.className);

      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(timingData.date);
        calendarApi.changeView("timeGridDay");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding timing");
    }
  };

  const handleDeleteTiming = async (id) => {
    if (!window.confirm("Delete this timing?")) return;
    try {
      await api.delete(`/timetables/timings/${id}`);
      fetchTimings(selectedClass._id, selectedClass.className);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Detect if mobile
  const isMobile = window.innerWidth < 768;

  // Custom MUI theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
        contrastText: "#ffffff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="p-4 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold">My Timetable</h2>
            {selectedClass && (
              <p className="text-gray-600">
                {selectedClass.className} (Semester {selectedClass.semester})
              </p>
            )}
          </div>
          {user?.role === "admin" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", "&:hover": { bgColor: "#333" } }}
                onClick={() => setOpenClass(true)}
              >
                Add Class
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", "&:hover": { bgColor: "#333" } }}
                onClick={() => setOpenTiming(true)}
                disabled={!selectedClass}
              >
                Add Timing
              </Button>
            </div>
          )}
        </div>

        {/* Class Selector */}
        <div className="mb-4 w-full max-w-sm">
          <FormControl fullWidth>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass?._id || ""}
              onChange={(e) => {
                const cls = classes.find((c) => c._id === e.target.value);
                setSelectedClass(cls);
                fetchTimings(cls._id, cls.className);
              }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.className} (Sem {cls.semester})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Calendar */}
        <div className="w-full overflow-x-auto">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            headerToolbar={
              isMobile
                ? {
                    left: "prev,next",
                    center: "title",
                    right: "", // remove view buttons on mobile
                  }
                : {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }
            }
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            nowIndicator={true}
            events={events}
            height="auto"
            firstDay={1}
            slotDuration="01:00:00"
            weekends={true}
            eventDisplay="block"
            displayEventTime={true}
            forceEventDuration={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dayHeaderFormat={{ weekday: "short" }}
            eventClick={(info) => {
              if (user?.role === "admin") handleDeleteTiming(info.event.id);
            }}
            windowResize={(arg) => {
              if (window.innerWidth < 768) {
                arg.view.calendar.changeView("timeGridDay");
              } else {
                arg.view.calendar.changeView("timeGridWeek");
              }
            }}
            // Custom styles for mobile title
            dayHeaderClassNames="text-sm sm:text-base"
          />
        </div>

        {/* Add Class Dialog */}
        <Dialog
          open={openClass}
          onClose={() => setOpenClass(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Class</DialogTitle>
          <DialogContent>
            <form onSubmit={handleCreateClass} className="space-y-3 mt-2">
              <TextField
                fullWidth
                label="Class Name"
                required
                value={classData.className}
                onChange={(e) =>
                  setClassData({ ...classData, className: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={classData.semester}
                  onChange={(e) =>
                    setClassData({ ...classData, semester: e.target.value })
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenClass(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateClass}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Timing Dialog */}
        <Dialog
          open={openTiming}
          onClose={() => setOpenTiming(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Class Timing</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddTiming} className="space-y-3 mt-2">
              <TextField
                fullWidth
                label="Subject"
                required
                value={timingData.subject}
                onChange={(e) =>
                  setTimingData({ ...timingData, subject: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Date"
                type="date"
                required
                value={timingData.date}
                onChange={(e) =>
                  setTimingData({ ...timingData, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                required
                value={timingData.startTime}
                onChange={(e) =>
                  setTimingData({ ...timingData, startTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="time"
                required
                value={timingData.endTime}
                onChange={(e) =>
                  setTimingData({ ...timingData, endTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Instructor"
                required
                value={timingData.instructor}
                onChange={(e) =>
                  setTimingData({
                    ...timingData,
                    instructor: e.target.value,
                  })
                }
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTiming(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddTiming}>
              Add Timing
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default Timetable;
