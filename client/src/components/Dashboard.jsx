import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, Avatar,
  Fade, Paper, Menu, MenuItem, Divider, ListItemIcon
} from '@mui/material';
import {
  Logout, Campaign, Schedule, FindInPage, School, Person, 
  AccountCircle, ExpandMore, CalendarToday, Settings as SettingsIcon, Home as HomeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Home from './Home';
import Announcements from './Announcements';
import Timetable from './Timetable';
import LostFound from './LostFound';
import PersonalTimetable from './PersonalTimetable';
import NotificationCenter from './NotificationCenter';
import Profile from './Profile';
import Settings from './Settings';
import Chatbot from './Chatbot';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ py: index === 0 ? 0 : 3, px: index === 0 ? 0 : 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileClick = () => { setTab(5); handleMenuClose(); };
  const handleSettingsClick = () => { setTab(6); handleMenuClose(); };
  const handleLogout = () => { handleMenuClose(); logout(); };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8FAFA',
        fontFamily: "'Space Grotesk', sans-serif", // apply globally
        '& *': { fontFamily: "'Space Grotesk', sans-serif" } // force all children
      }}
    >
      {/* Top App Bar */}
      <AppBar position="static" elevation={0}
        sx={{ 
          background: 'white',
          color: 'black',
          fontFamily: "'Space Grotesk', sans-serif"
        }}
      >
        <Toolbar sx={{ py: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', ml: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700,fontFamily: "'Space Grotesk', sans-serif" }}>
                CAMPUS COMPANION
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Campus</Typography>
            </Box>
          </Box>

          {/* Center: Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1, gap: 2 }}>
            {['HOME', 'ANNOUNCEMENTS', 'SCHEDULE', 'MY PLANS', 'LOST & FOUND'].map((label, i) => (
              <Button
                key={label}
                color="inherit"
                onClick={() => setTab(i)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: tab === i ? 'black' : 'grey.700',
                  bgcolor: 'transparent',
                  '&:hover': { color: 'black', bgcolor: 'rgba(0,0,0,0.05)' }
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Right: Notification & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: '0 0 auto' }}>
            <NotificationCenter />
            <Button color="inherit" onClick={handleMenuOpen} endIcon={<ExpandMore />}
              sx={{ textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <Avatar
                src={user?.profileImage}
                sx={{ mr: 1, width: 32, height: 32, background: user?.profileImage ? 'transparent' : 'linear-gradient(45deg,#F5BABB,#E8989A)' }}
              >
                {!user?.profileImage && <Person />}
              </Avatar>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600,fontFamily: "'Space Grotesk', sans-serif" }}>{user?.name.toUpperCase()}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>{user?.studentId}</Typography>
              </Box>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
              PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
            >
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <Avatar src={user?.profileImage} sx={{ width: 24, height: 24, background: user?.profileImage ? 'transparent' : 'linear-gradient(45deg,#F5BABB,#E8989A)' }}>
                    {!user?.profileImage && <AccountCircle sx={{ fontSize: 16 }} />}
                  </Avatar>
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettingsClick}>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Full Width Content */}
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ borderRadius: 0, overflow: 'hidden', width: '100%' }}>
          <TabPanel value={tab} index={0}><Home /></TabPanel>
          <TabPanel value={tab} index={1}><Announcements /></TabPanel>
          <TabPanel value={tab} index={2}><Timetable /></TabPanel>
          <TabPanel value={tab} index={3}><PersonalTimetable /></TabPanel>
          <TabPanel value={tab} index={4}><LostFound /></TabPanel>
          <TabPanel value={tab} index={5}><Profile /></TabPanel>
          <TabPanel value={tab} index={6}><Settings /></TabPanel>
        </Paper>
      </Box>

      {/* Chatbot */}
      <Chatbot />
    </Box>
  );
}


export default Dashboard;
