import React from 'react';
import { Box, Typography, Container, Card, Chip } from '@mui/material';
import { Gavel, AccountCircle, Security, Warning } from '@mui/icons-material';

const TermsOfService = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
          Terms of Service
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Please read these terms carefully before using Campus Companion.
        </Typography>
        <Typography sx={{ color: '#999', mt: 2 }}>Effective Date: January 1, 2025</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
        <Chip label="Student Agreement" variant="outlined" />
        <Chip label="Academic Use" variant="outlined" />
        <Chip label="Data Protection" variant="outlined" />
        <Chip label="Community Guidelines" variant="outlined" />
      </Box>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccountCircle sx={{ fontSize: '2rem', color: '#333', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Acceptance of Terms
          </Typography>
        </Box>
        <Typography sx={{ color: '#666', mb: 2 }}>
          By accessing and using Campus Companion, you accept and agree to be bound by the terms and 
          provision of this agreement. This service is intended for students, faculty, and staff of 
          Godavari Global University.
        </Typography>
        <Typography sx={{ color: '#666' }}>
          If you do not agree to abide by the above, please do not use this service.
        </Typography>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Gavel sx={{ fontSize: '2rem', color: '#333', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Permitted Use
          </Typography>
        </Box>
        <Typography sx={{ color: '#666', mb: 2 }}>
          Campus Companion is designed for academic and educational purposes. You may use this service to:
        </Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Access your academic schedule and course information</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Receive campus announcements and notifications</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Report and search for lost items on campus</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Interact with our AI assistant for academic support</Typography>
          <Typography sx={{ color: '#666' }}>• Create and manage personal study plans</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Warning sx={{ fontSize: '2rem', color: '#f44336', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Prohibited Activities
          </Typography>
        </Box>
        <Typography sx={{ color: '#666', mb: 2 }}>
          The following activities are strictly prohibited:
        </Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Sharing false or misleading information</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Attempting to access other users' accounts</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Using the platform for commercial purposes</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Posting inappropriate or offensive content</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Interfering with the platform's functionality</Typography>
          <Typography sx={{ color: '#666' }}>• Violating any applicable laws or regulations</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Security sx={{ fontSize: '2rem', color: '#333', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Account Responsibility
          </Typography>
        </Box>
        <Typography sx={{ color: '#666', mb: 2 }}>
          You are responsible for maintaining the confidentiality of your account and password. You agree to:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Keep your login credentials secure and confidential</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Notify us immediately of any unauthorized access</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Accept responsibility for all activities under your account</Typography>
          <Typography sx={{ color: '#666' }}>• Provide accurate and up-to-date information</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Service Availability
        </Typography>
        <Typography sx={{ color: '#666', mb: 2 }}>
          While we strive to provide continuous service, Campus Companion may be temporarily unavailable 
          due to maintenance, updates, or technical issues. We reserve the right to modify or discontinue 
          the service with reasonable notice.
        </Typography>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Limitation of Liability
        </Typography>
        <Typography sx={{ color: '#666', mb: 2 }}>
          Campus Companion is provided "as is" without warranties of any kind. We are not liable for any 
          direct, indirect, incidental, or consequential damages arising from your use of the service.
        </Typography>
      </Card>

      <Card sx={{ p: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Contact Information
        </Typography>
        <Typography sx={{ color: '#666' }}>
          If you have any questions about these Terms of Service, please contact us at:
          <br />
          Email: legal@campuscompanion.edu
          <br />
          Phone: +91 93903 32543
        </Typography>
      </Card>
    </Container>
  );
};

export default TermsOfService;