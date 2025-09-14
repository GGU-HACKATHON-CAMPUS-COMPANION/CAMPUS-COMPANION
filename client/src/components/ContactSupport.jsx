import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { Email, Phone, LocationOn, AccessTime } from '@mui/icons-material';

const ContactSupport = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
          Contact Support
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Need help? Our support team is here to assist you with any questions or issues.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 6 }}>
        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Email sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Email Support</Typography>
          <Typography sx={{ color: '#666', mb: 2 }}>Get help via email</Typography>
          <Typography sx={{ color: '#333', fontWeight: 500 }}>support@campuscompanion.edu</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Phone sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Phone Support</Typography>
          <Typography sx={{ color: '#666', mb: 2 }}>Call us directly</Typography>
          <Typography sx={{ color: '#333', fontWeight: 500 }}>+91 93903 32543</Typography>
        </Card>
      </Box>

      <Card sx={{ p: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccessTime sx={{ fontSize: '2rem', color: '#333', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Support Hours</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Monday - Friday</Typography>
            <Typography sx={{ color: '#666' }}>8:00 AM - 6:00 PM</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Weekend</Typography>
            <Typography sx={{ color: '#666' }}>10:00 AM - 4:00 PM</Typography>
          </Box>
        </Box>
      </Card>

      <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOn sx={{ fontSize: '2rem', color: '#333', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Visit Us</Typography>
        </Box>
        <Typography sx={{ color: '#666', mb: 2 }}>
          Campus Companion Support Center<br />
          Godavari Global University<br />
          Main Campus, Building A, Room 101<br />
          Rajahmundry, Andhra Pradesh 533296
        </Typography>
      </Card>
    </Container>
  );
};

export default ContactSupport;