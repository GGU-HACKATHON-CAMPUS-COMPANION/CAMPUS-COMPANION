import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, Avatar,
  Menu, MenuItem, IconButton, Divider, ListItemIcon, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import {
  Logout, Settings as SettingsIcon, Person, ExpandMore, Menu as MenuIcon
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
      {value === index && <Box sx={{}}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileClick = () => { setTab(5); handleMenuClose(); };
  const handleSettingsClick = () => { setTab(6); handleMenuClose(); };
  const handleLogout = () => { handleMenuClose(); logout(); };

  const navItems = ['HOME', 'ANNOUNCEMENTS', 'SCHEDULE', 'MY PLANS', 'LOST & FOUND'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFA', fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Top App Bar */}
      <AppBar position="static" elevation={0} sx={{ background: 'white', color: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Left: Logo */}
          <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            CAMPUS COMPANION
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: 'block', sm: 'none' } }}>
            Campus
          </Typography>

          {/* Center: Navigation for md+ */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((label, i) => (
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

          {/* Right: Notification, Profile, Burger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationCenter />
            
            {/* Burger Menu for xs, sm */}
            <IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>

            {/* Profile */}
            <Button color="inherit" onClick={handleMenuOpen} endIcon={<ExpandMore />} sx={{ textTransform: 'none' }}>
              <Avatar src={user?.profileImage} sx={{ mr: 1, width: 32, height: 32 }}>
                {!user?.profileImage && <Person />}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name.toUpperCase()}</Typography>
              </Box>
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettingsClick}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 250 }}>
          {navItems.map((label, i) => (
            <ListItem button key={label} onClick={() => { setTab(i); setDrawerOpen(false); }}>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Content */}
      <Box sx={{ width: '100%', minHeight: '100vh' }}>
        <TabPanel value={tab} index={0}><Home /></TabPanel>
        <TabPanel value={tab} index={1}><Announcements /></TabPanel>
        <TabPanel value={tab} index={2}><Timetable /></TabPanel>
        <TabPanel value={tab} index={3}><PersonalTimetable /></TabPanel>
        <TabPanel value={tab} index={4}><LostFound /></TabPanel>
        <TabPanel value={tab} index={5}><Profile /></TabPanel>
        <TabPanel value={tab} index={6}><Settings /></TabPanel>
      </Box>

      <Chatbot />
    </Box>
  );
}

export default Dashboard;
