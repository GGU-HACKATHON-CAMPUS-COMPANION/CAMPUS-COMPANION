import { useState } from 'react';
import {
  Fab, Dialog, DialogTitle, DialogContent, Box, TextField, IconButton,
  Typography, Paper, Avatar, Slide, InputAdornment, Tooltip
} from '@mui/material';
import {
  Chat, Close, Send, SmartToy, Person
} from '@mui/icons-material';

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Campus Companion assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // Bot responses
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 1000);
    
    setInput('');
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('announcement') || msg.includes('news')) {
      return "You can check the latest campus announcements in the Announcements tab. They're organized by category and priority!";
    }
    if (msg.includes('timetable') || msg.includes('schedule') || msg.includes('class')) {
      return "Your class timetable is available in the Timetable section. You can view your weekly schedule there!";
    }
    if (msg.includes('lost') || msg.includes('found')) {
      return "Check the Lost & Found section to report lost items or see if someone found your belongings!";
    }
    if (msg.includes('help') || msg.includes('how')) {
      return "I can help you navigate the campus companion app! Ask me about announcements, timetables, or lost & found items.";
    }
    return "I'm here to help! You can ask me about announcements, timetables, lost & found items, or general campus information.";
  };

  return (
    <>
      <Tooltip title="Chat with Campus Assistant" placement="right">
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            background: 'linear-gradient(45deg, #568F87, #064232)',
            '&:hover': {
              background: 'linear-gradient(45deg, #064232, #568F87)',
            },
            boxShadow: '0 8px 25px rgba(86, 143, 135, 0.3)'
          }}
        >
          <Chat />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: { xs: 80, sm: 90 },
            right: { xs: 16, sm: 24 },
            m: 0,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
            height: { xs: 'calc(100vh - 160px)', sm: 480 },
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #568F87 0%, #064232 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SmartToy />
            <Typography variant="h6">Campus Assistant</Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', maxHeight: 350 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                display="flex"
                justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Box display="flex" alignItems="flex-start" gap={1} maxWidth="80%">
                  {message.sender === 'bot' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#568F87' }}>
                      <SmartToy sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? '#568F87' : '#F5BABB',
                      color: message.sender === 'user' ? 'white' : '#064232'
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Paper>
                  {message.sender === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#F5BABB' }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #F5BABB' }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend} color="primary">
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Chatbot;