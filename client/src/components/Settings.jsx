import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Switch, FormControlLabel, Button,
  Divider, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  Select, MenuItem, FormControl, InputLabel, Slider, Alert
} from '@mui/material';
import {
  Notifications, DarkMode, Language, Security, Lock, Help,
  VolumeUp, Wifi, Storage, Info
} from '@mui/icons-material';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    soundEnabled: true,
    volume: 70,
    dataUsage: 'wifi',
    privacy: 'friends'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: <Notifications />,
      items: [
        {
          label: 'Push Notifications',
          key: 'notifications',
          type: 'switch',
          description: 'Receive notifications for announcements and updates'
        },
        {
          label: 'Sound',
          key: 'soundEnabled',
          type: 'switch',
          description: 'Play sound for notifications'
        },
        {
          label: 'Volume',
          key: 'volume',
          type: 'slider',
          description: 'Notification volume level'
        }
      ]
    },

    {
      title: 'Data & Storage',
      icon: <Storage />,
      items: [
        {
          label: 'Auto Sync',
          key: 'autoSync',
          type: 'switch',
          description: 'Automatically sync data when connected'
        },
        {
          label: 'Data Usage',
          key: 'dataUsage',
          type: 'select',
          options: [
            { value: 'wifi', label: 'Wi-Fi Only' },
            { value: 'cellular', label: 'Wi-Fi + Cellular' },
            { value: 'offline', label: 'Offline Mode' }
          ],
          description: 'Control when app uses data'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Lock />,
      items: [
        {
          label: 'Profile Visibility',
          key: 'privacy',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'friends', label: 'Friends Only' },
            { value: 'private', label: 'Private' }
          ],
          description: 'Who can see your profile information'
        }
      ]
    }
  ];

  const renderSettingControl = (item) => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            checked={settings[item.key]}
            onChange={(e) => handleSettingChange(item.key, e.target.checked)}
            color="primary"
          />
        );
      case 'select':
        return (
          <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
            <Select
              value={settings[item.key]}
              onChange={(e) => handleSettingChange(item.key, e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              {item.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'slider':
        return (
          <Box sx={{ width: { xs: 80, sm: 120 }, mr: 2 }}>
            <Slider
              value={settings[item.key]}
              onChange={(e, value) => handleSettingChange(item.key, value)}
              color="primary"
              size="small"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 3, sm: 4 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Settings
        </Typography>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #568F87, #064232)'
          }}
        >
          Save All
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Changes are automatically saved. Some settings may require app restart to take effect.
      </Alert>

      {settingSections.map((section, sectionIndex) => (
        <Card key={sectionIndex} sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }} mb={2}>
              {section.icon}
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                {section.title}
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {section.items.map((item, itemIndex) => (
                <Box key={itemIndex}>
                  <ListItem sx={{ 
                    px: 0, 
                    py: { xs: 1.5, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}>
                          {item.description}
                        </Typography>
                      }
                    />
                    <Box sx={{ 
                      position: { xs: 'static', sm: 'absolute' },
                      right: { sm: 16 },
                      top: { sm: '50%' },
                      transform: { sm: 'translateY(-50%)' },
                      width: { xs: '100%', sm: 'auto' },
                      display: 'flex',
                      justifyContent: { xs: 'flex-end', sm: 'center' }
                    }}>
                      {renderSettingControl(item)}
                    </Box>
                  </ListItem>
                  {itemIndex < section.items.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Quick Actions
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Help />}
              sx={{ 
                borderRadius: 2, 
                justifyContent: 'flex-start',
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Help & Support
            </Button>
            <Button
              variant="outlined"
              startIcon={<Info />}
              sx={{ 
                borderRadius: 2, 
                justifyContent: 'flex-start',
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              About Campus Companion
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ 
                borderRadius: 2, 
                justifyContent: 'flex-start',
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Clear Cache & Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card sx={{ mt: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Campus Companion
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              v1.0.0
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: { xs: 2, sm: 3 }, lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Your intelligent campus assistant designed to make student life easier and more connected.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                🎓 For Students, By Students
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Built at Godavari Global University
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                🚀 Features
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                AI Assistant • Timetables • Lost & Found • Announcements
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                💻 Tech Stack
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                React • Node.js • MongoDB • Material-UI
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            "Making campus life easier, one conversation at a time!"
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;