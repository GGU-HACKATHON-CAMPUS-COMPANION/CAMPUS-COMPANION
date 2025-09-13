import { useState } from 'react';
import {
  IconButton, Badge, Popover, List, ListItem, ListItemText, ListItemIcon,
  Typography, Box, Divider, Button
} from '@mui/material';
import {
  Notifications, Campaign, FindInPage, Schedule, CheckCircle
} from '@mui/icons-material';

function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'announcement',
      title: 'New Campus Event',
      message: 'Tech fest registration is now open',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'lostfound',
      title: 'Item Found',
      message: 'Someone found your lost phone',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'schedule',
      title: 'Class Reminder',
      message: 'Mathematics class in 30 minutes',
      time: '30 min ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'announcement': return <Campaign color="primary" />;
      case 'lostfound': return <FindInPage color="secondary" />;
      case 'schedule': return <Schedule color="info" />;
      default: return <Notifications />;
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 350, maxHeight: 400, borderRadius: 2 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem
                button
                onClick={() => markAsRead(notification.id)}
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'rgba(86, 143, 135, 0.05)',
                  '&:hover': { bgcolor: 'rgba(86, 143, 135, 0.1)' }
                }}
              >
                <ListItemIcon>
                  {getIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        {notifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}

export default NotificationCenter;