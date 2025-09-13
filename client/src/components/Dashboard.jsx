import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, Button, IconButton,
  Avatar, Chip, Fade, Slide, Paper, Menu, MenuItem, Divider, ListItemIcon
} from '@mui/material';
import {
  Logout, Campaign, Schedule, FindInPage, School, Person, Settings, 
  AccountCircle, ExpandMore, CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Announcements from './Announcements';
import Timetable from './Timetable';
import LostFound from './LostFound';
import PersonalTimetable from './PersonalTimetable';
import NotificationCenter from './NotificationCenter';
import Chatbot from './Chatbot';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFA' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #568F87 0%, #064232 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ 
              mr: 2, 
              background: 'linear-gradient(45deg, #F5BABB, #E8989A)'
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
            <NotificationCenter />
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              endIcon={<ExpandMore />}
              sx={{
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                <Person />
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {user?.studentId}
                </Typography>
              </Box>
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            border: '1px solid #F5BABB'
          }}
        >
          <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)} 
            centered
            sx={{
              bgcolor: '#FFFFFF',
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(45deg, #568F87, #F5BABB)',
                height: 3,
                borderRadius: 2
              },
              '& .MuiTab-root': {
                minHeight: 72,
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-selected': {
                  color: '#568F87'
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
            <Tab 
              icon={<CalendarToday />} 
              label="My Schedule" 
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
          <TabPanel value={tab} index={3}>
            <PersonalTimetable />
          </TabPanel>
        </Paper>
      </Container>
      
      <Chatbot />
    </Box>
  );
}

export default Dashboard;