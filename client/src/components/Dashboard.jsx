import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, Button, IconButton
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Announcements from './Announcements';
import Timetable from './Timetable';
import LostFound from './LostFound';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Campus Companion - Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered sx={{ mt: 2 }}>
          <Tab label="Announcements" />
          <Tab label="Timetable" />
          <Tab label="Lost & Found" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <Announcements />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Timetable />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <LostFound />
        </TabPanel>
      </Container>
    </>
  );
}

export default Dashboard;