import React from 'react';
import { Box, Typography, Container, Card, Divider } from '@mui/material';
import { Security, Visibility, DataUsage, Shield } from '@mui/icons-material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
          Privacy Policy
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Your privacy is important to us. Learn how we protect and handle your data.
        </Typography>
        <Typography sx={{ color: '#999', mt: 2 }}>Last updated: January 2025</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 6 }}>
        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Security sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Secure</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>End-to-end encryption</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Visibility sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Transparent</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Clear data usage</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <DataUsage sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Minimal</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Only necessary data</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Shield sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Protected</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>GDPR compliant</Typography>
        </Card>
      </Box>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Information We Collect
        </Typography>
        <Typography sx={{ color: '#666', mb: 3 }}>
          We collect only the information necessary to provide you with the best Campus Companion experience:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Account information (name, email, student ID)</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Academic schedule and course information</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Lost & found item reports and communications</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Chat interactions with our AI assistant</Typography>
          <Typography sx={{ color: '#666' }}>• Usage analytics to improve our services</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          How We Use Your Information
        </Typography>
        <Typography sx={{ color: '#666', mb: 3 }}>
          Your data is used exclusively to enhance your campus experience:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Personalize your schedule and announcements</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Provide AI-powered academic assistance</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Connect you with lost items and their owners</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Send relevant campus notifications</Typography>
          <Typography sx={{ color: '#666' }}>• Improve our platform based on usage patterns</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Data Security & Storage
        </Typography>
        <Typography sx={{ color: '#666', mb: 2 }}>
          We implement industry-standard security measures to protect your information:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• All data is encrypted in transit and at rest</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Regular security audits and updates</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Access controls and authentication protocols</Typography>
          <Typography sx={{ color: '#666' }}>• Secure cloud infrastructure with backup systems</Typography>
        </Box>
      </Card>

      <Card sx={{ p: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Your Rights
        </Typography>
        <Typography sx={{ color: '#666', mb: 2 }}>
          You have complete control over your personal data:
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography sx={{ color: '#666', mb: 1 }}>• Access and download your data at any time</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Request corrections to inaccurate information</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Delete your account and all associated data</Typography>
          <Typography sx={{ color: '#666', mb: 1 }}>• Opt out of non-essential communications</Typography>
          <Typography sx={{ color: '#666' }}>• Contact us with any privacy concerns</Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;