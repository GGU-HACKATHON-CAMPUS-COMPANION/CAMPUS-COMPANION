import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { Lightbulb, People, School, TrendingUp } from '@mui/icons-material';

const OurMission = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
          Our Mission
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '800px', mx: 'auto', mb: 4 }}>
          Empowering students with intelligent technology to enhance their academic journey and campus experience.
        </Typography>
      </Box>

      <Card sx={{ p: 6, mb: 6, textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          "Connecting Every Semester, Every Experience"
        </Typography>
        <Typography sx={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', mx: 'auto' }}>
          At Campus Companion, we believe that technology should simplify student life, not complicate it. 
          Our mission is to create an intelligent, intuitive platform that brings together all aspects of 
          campus life into one seamless experience.
        </Typography>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 6 }}>
        <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Lightbulb sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Innovation</Typography>
          <Typography sx={{ color: '#666' }}>
            We leverage cutting-edge AI and modern web technologies to create solutions that anticipate 
            student needs and provide proactive assistance throughout their academic journey.
          </Typography>
        </Card>

        <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <People sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Community</Typography>
          <Typography sx={{ color: '#666' }}>
            Building stronger campus communities by connecting students, faculty, and staff through 
            shared experiences, lost & found networks, and collaborative academic support.
          </Typography>
        </Card>

        <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <School sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Academic Excellence</Typography>
          <Typography sx={{ color: '#666' }}>
            Supporting academic success through intelligent scheduling, personalized study plans, 
            and AI-powered academic mentoring that adapts to each student's unique learning style.
          </Typography>
        </Card>

        <Card sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <TrendingUp sx={{ fontSize: '3rem', color: '#333', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Continuous Growth</Typography>
          <Typography sx={{ color: '#666' }}>
            Constantly evolving based on student feedback and emerging technologies to ensure our 
            platform remains relevant, useful, and ahead of the curve in educational technology.
          </Typography>
        </Card>
      </Box>

      <Card sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Built by Students, for Students
        </Typography>
        <Typography sx={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Campus Companion was created by students who understand the challenges of modern campus life. 
          We're committed to making every semester smoother, every experience more connected, and every 
          student more empowered to succeed.
        </Typography>
      </Card>
    </Container>
  );
};

export default OurMission;