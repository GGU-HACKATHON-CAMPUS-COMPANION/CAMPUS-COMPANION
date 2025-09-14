import React from 'react';
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails, Card } from '@mui/material';
import { ExpandMore, QuestionAnswer, School, Schedule, FindInPage } from '@mui/icons-material';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I access my class schedule?",
      answer: "Navigate to the Schedule section from the main menu. Your personalized timetable will display all your classes with room numbers and timings."
    },
    {
      question: "How does the Lost & Found feature work?",
      answer: "You can report lost items or browse found items in the Lost & Found section. Upload photos and descriptions to help reunite items with their owners."
    },
    {
      question: "Can I customize my announcement feed?",
      answer: "Yes! Go to your profile settings to select which types of announcements you want to receive based on your courses and interests."
    },
    {
      question: "How do I use the AI Campus Assistant?",
      answer: "Click the chat icon in the bottom right corner. The AI can help with campus information, schedule queries, and general student support."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and follow strict privacy policies to protect your personal information."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
          Help Center
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
          Find answers to common questions and learn how to make the most of Campus Companion.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 6 }}>
        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Schedule sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Schedules</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Manage your timetable</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <FindInPage sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Lost & Found</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Report and find items</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <School sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Announcements</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Stay updated</Typography>
        </Card>

        <Card sx={{ p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <QuestionAnswer sx={{ fontSize: '2.5rem', color: '#333', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>AI Assistant</Typography>
          <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>Get instant help</Typography>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: '#333' }}>
          Frequently Asked Questions
        </Typography>
        
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: '#666' }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default HelpCenter;