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
    darkMode: false,
    language: 'english',
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
      title: 'Appearance',
      icon: <DarkMode />,
      items: [
        {
          label: 'Dark Mode',
          key: 'darkMode',
          type: 'switch',
          description: 'Switch to dark theme'
        },
        {
          label: 'Language',
          key: 'language',
          type: 'select',
          options: [
            { value: 'english', label: 'English' },
            { value: 'spanish', label: 'Español' },
            { value: 'french', label: 'Français' }
          ],
          description: 'Choose your preferred language'
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
          <FormControl size="small" sx={{ minWidth: 120 }}>
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
          <Box sx={{ width: 120, mr: 2 }}>
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
                  <ListItem sx={{ px: 0, py: { xs: 1.5, sm: 2 } }}>
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
                    <ListItemSecondaryAction>
                      {renderSettingControl(item)}
                    </ListItemSecondaryAction>
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
          
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Help />}
              sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
            >
              Help & Support
            </Button>
            <Button
              variant="outlined"
              startIcon={<Info />}
              sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
            >
              About Campus Companion
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
            >
              Clear Cache & Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* App Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Campus Companion v1.0.0
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Built with ❤️ for students
        </Typography>
      </Box>
    </Box>
  );
}

export default Settings;