import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, Avatar,
  Fade, Paper, Menu, MenuItem, Divider, ListItemIcon,
  Drawer, List, ListItem, ListItemButton, ListItemText, IconButton
} from '@mui/material';
import {
  Logout, Campaign, Schedule, FindInPage, School, Person, 
  AccountCircle, ExpandMore, CalendarToday, Settings as SettingsIcon, Home as HomeIcon,
  Menu as MenuIcon
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



function Dashboard() {
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const pathToTab = {
      '/': 0,
      '/home': 0,
      '/announcements': 1,
      '/schedule': 2,
      '/plans': 3,
      '/lost-found': 4
    };
    setTab(pathToTab[location.pathname] || 0);
  }, [location.pathname]);
  
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileClick = () => { navigate('/profile'); handleMenuClose(); };
  const handleSettingsClick = () => { navigate('/settings'); handleMenuClose(); };
  const handleLogout = () => { handleMenuClose(); logout(); };
  
  const renderContent = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return <Home />;
      case '/announcements':
        return <Announcements />;
      case '/schedule':
        return <Timetable />;
      case '/plans':
        return <PersonalTimetable />;
      case '/lost-found':
        return <LostFound />;
      case '/profile':
        return <Profile />;
      case '/settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8FAFA',
        fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif", // apply globally
        '& *': { fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif" } // force all children
      }}
    >
      {/* Top App Bar */}
      <AppBar position="fixed" elevation={0}
        sx={{ 
          background: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'white',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          color: 'black',
          fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar sx={{ py: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Mobile Menu + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', gap: 1 }}>
            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: 'block', md: 'none' }, color: 'black' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="h6" 
                onClick={() => navigate('/home')}
                sx={{ 
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif",
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                CAMPUS COMPANION
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Typography 
                variant="h6" 
                onClick={() => navigate('/home')}
                sx={{ 
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Campus
              </Typography>
            </Box>
          </Box>

          {/* Center: Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flex: 1, gap: 2 }}>
            {[
              { label: 'ANNOUNCEMENTS', path: '/announcements' },
              { label: 'SCHEDULE', path: '/schedule' },
              { label: 'MY PLANS', path: '/plans' },
              { label: 'LOST & FOUND', path: '/lost-found' }
            ].map((item, i) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: tab === i + 1 ? 'black' : 'grey.700',
                  bgcolor: 'transparent',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: tab === i + 1 ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: 'black',
                    transform: 'translateX(-50%)',
                    transition: 'width 0.3s ease'
                  },
                  '&:hover': { 
                    color: 'black', 
                    bgcolor: 'transparent',
                    '&::after': {
                      width: '100%'
                    }
                  }
                }}
              >
                {item.label}
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
                <Typography variant="body2" sx={{ fontWeight: 600,fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif" }}>{user?.name.toUpperCase()}</Typography>
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
          <Fade in={true} timeout={300}>
            <Box sx={{ pt: ['/home', '/'].includes(location.pathname) ? 0 : 10, pb: ['/home', '/'].includes(location.pathname) ? 0 : 3, px: ['/home', '/'].includes(location.pathname) ? 0 : 3 }}>
              {renderContent()}
            </Box>
          </Fade>
        </Paper>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, pt: 3 }}>
          <List sx={{ px: 2 }}>
            {[
              { label: 'ANNOUNCEMENTS', path: '/announcements' },
              { label: 'SCHEDULE', path: '/schedule' },
              { label: 'MY PLANS', path: '/plans' },
              { label: 'LOST & FOUND', path: '/lost-found' }
            ].map((item, index) => (
              <Box key={item.label}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      py: 2,
                      px: 3,
                      borderRadius: 2,
                      mb: 1,
                      fontWeight: 700,
                      color: location.pathname === item.path ? 'black' : 'grey.700',
                      bgcolor: location.pathname === item.path ? 'rgba(0,0,0,0.05)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < 3 && <Divider sx={{ mx: 2, my: 1 }} />}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Chatbot */}
      <Chatbot />
    </Box>
  );
}


export default Dashboard;
