import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar, CircularProgress, Fab, Dialog, DialogContent, IconButton, Slide, Tooltip } from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon, Person as PersonIcon, Close, Chat } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 'guest';
  const CHAT_URL = import.meta.env.VITE_CHAT_URL || 'http://localhost:3000/chat';
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          message: input
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { role: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot connection error:', error);
      let errorMessage;
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = { 
          role: 'bot', 
          content: '🚫 **Chatbot server is not running!**\n\nPlease start the chatbot server:\n```bash\ncd chatbot\nnpm start\n```\n\nThe chatbot should be running on http://localhost:3000' 
        };
      } else {
        errorMessage = { 
          role: 'bot', 
          content: `❌ **Connection Error**\n\nSorry, I encountered an error: ${error.message}\n\nPlease check if the chatbot server is running on port 3000.` 
        };
      }
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Tooltip title="Chat with Campus Assist" placement="right">
        <Box
  onClick={() => setOpen(true)}
  sx={{
    position: "fixed",
    bottom: { xs: 16, sm: 24 },
    right: { xs: 16, sm: 24 },
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  }}
>
  <Fab
    sx={{
      background: "linear-gradient(145deg, #ffffff 0%, #e6e6e6 100%)", // glossy gradient
      border: "2px solid rgba(0,0,0,0.1)",
      boxShadow:
        "0 4px 8px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.6)", // outer + inner shadows
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        background: "linear-gradient(145deg, #f9f9f9 0%, #dcdcdc 100%)",
      },
    }}
  >
    {/* Glossy shine overlay */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0))",
        borderTopLeftRadius: "50%",
        borderTopRightRadius: "50%",
      }}
    />

    {/* Icon/Image in center */}
    <img
      src="/ggg.png"
      alt="Campus Assist"
      style={{
        width: 28,
        height: 28,
        zIndex: 2,
      }}
    />
  </Fab>
</Box>

      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: { xs: 80, sm: 90 },
            right: { xs: 16, sm: 24 },
            m: 0,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
            height: { xs: 'calc(100vh - 160px)', sm: 480 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            background: 'rgba(255,255,255,0.05)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              borderRadius: 'inherit',
              zIndex: -1
            }
          }
        }}
      >
        <Box sx={{ 
          background: 'rgba(0,0,0,0.1)', 
          color: 'white', 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/ggg.png" alt="Campus Assist" style={{ width: 28, height: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Orbitron', 'Roboto Mono', monospace", letterSpacing: '1px' }}>CAMPUS ASSIST</Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 1,
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              pointerEvents: 'none',
              zIndex: -1
            },
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {messages.length === 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                mb: 1 
              }}>
                <Box sx={{
                  maxWidth: '75%',
                  bgcolor: '#fff',
                  borderRadius: '18px 18px 18px 4px',
                  p: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  position: 'relative',
                  border: '1px solid #ddd'
                }}>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Hi! I'm your Campus Assist 😊 Ask me anything!
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', mt: 0.5, display: 'block' }}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {messages.map((message, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Box sx={{
                  maxWidth: '75%',
                  bgcolor: message.role === 'user' 
                    ? '#fff' 
                    : '#fff',
                  color: 'black',
                  border: '1px solid #ddd',
                  borderRadius: message.role === 'user' 
                    ? '18px 18px 4px 18px' 
                    : '18px 18px 18px 4px',
                  p: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  {message.role === 'bot' ? (
                    <Box sx={{ '& p': { m: 0 }, '& pre': { fontSize: '0.8rem' } }}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {message.content}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ 
                    color: '#999', 
                    mt: 0.5, 
                    display: 'block',
                    textAlign: message.role === 'user' ? 'right' : 'left'
                  }}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            {loading && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start',
                mb: 1
              }}>
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: '18px 18px 18px 4px',
                  p: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <CircularProgress size={16} sx={{ color: 'black' }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>Typing...</Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          <Box sx={{ 
            p: 1.5, 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              alignItems: 'flex-end',
              bgcolor: 'white',
              borderRadius: '25px',
              p: 0.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={loading}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem'
                  }
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                sx={{ 
                  bgcolor: input.trim() ? '#000' : '#e0e0e0',
                  color: 'white',
                  width: 40,
                  height: 40,
                  mr: 0.5,
                  '&:hover': {
                    bgcolor: input.trim() ? '#333' : '#e0e0e0'
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#999'
                  }
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;