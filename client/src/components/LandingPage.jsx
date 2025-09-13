import { Box, Typography, Button, Container, Fade } from '@mui/material';
import { Schedule, Campaign, FindInPage, ArrowForward } from '@mui/icons-material';

function LandingPage({ onExplore }) {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          zIndex: -1
        }}
        src="https://res.cloudinary.com/dwr6mvypn/video/upload/v1757752451/Inside_GGU__A_Stunning_Campus_Tour_You_Can_t_Miss_ggu_university_college_oah2w2.mp4"
      />

      {/* Overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 0
      }} />

      {/* Centered Content */}
      <Container maxWidth="md" sx={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 4
      }}>
        <Fade in={true} timeout={1000}>
          <Box>
            <Typography variant="h2" sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
            }}>
              Campus Companion
            </Typography>
            
            <Typography variant="h5" sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}>
              Your Digital Campus Assistant
            </Typography>
            
            <Box display="flex" justifyContent="center" gap={4} mb={6} sx={{ 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule />
                <Typography>Timetables</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Campaign />
                <Typography>Announcements</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <FindInPage />
                <Typography>Lost & Found</Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={onExplore}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #F5BABB, #E8989A)',
                color: '#064232',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(45deg, #E8989A, #F5BABB)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explore Now
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default LandingPage;
