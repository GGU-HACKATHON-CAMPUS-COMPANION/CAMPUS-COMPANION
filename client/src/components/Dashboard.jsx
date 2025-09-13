import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, Button, IconButton,
  Avatar, Chip, Fade, Slide, Paper
} from '@mui/material';
import {
  Logout, Campaign, Schedule, FindInPage, School, Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Announcements from './Announcements';
import Timetable from './Timetable';
import LostFound from './LostFound';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ p: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ 
              mr: 2, 
              background: 'linear-gradient(45deg, #f59e0b, #d97706)'
            }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Campus Companion
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Welcome back, {user?.name}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<Person />}
              label={user?.studentId}
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <IconButton 
              color="inherit" 
              onClick={logout}
              sx={{ 
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}
        >
          <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)} 
            centered
            sx={{
              bgcolor: 'background.paper',
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(45deg, #2563eb, #f59e0b)',
                height: 3,
                borderRadius: 2
              },
              '& .MuiTab-root': {
                minHeight: 72,
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-selected': {
                  color: '#2563eb'
                }
              }
            }}
          >
            <Tab 
              icon={<Campaign />} 
              label="Announcements" 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab 
              icon={<Schedule />} 
              label="Timetable" 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
            <Tab 
              icon={<FindInPage />} 
              label="Lost & Found" 
              iconPosition="start"
              sx={{ gap: 1 }}
            />
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
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;