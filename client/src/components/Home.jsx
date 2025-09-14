import { Box, Typography, Button } from '@mui/material';

function Home() {
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Video */}
      <video
        src="https://ggu.edu.in//wp-content//uploads//2025//05//Website-Video.mp4"
        autoPlay
        muted
        loop
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
        }}
      />

      {/* Overlay Text */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            whiteSpace: 'nowrap',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '4.5rem' },
            animation: 'fadeBlink 2s ease-in-out infinite',
          }}
        >
          CONNECT EVERY SEMESTER
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            whiteSpace: 'nowrap',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '4.5rem' },
            animation: 'fadeBlink 2s ease-in-out infinite',
          }}
        >
          EVERY EXPERIENCE!
        </Typography>

        {/* Buttons on the same line */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            sx={{
              background: 'white',
              color: 'black',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'none',
              transition: '0.3s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
                color: 'black',
                border: '2px solid rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            GET STARTED
          </Button>

          <Button
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              textTransform: 'none',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: '0.3s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
                color: 'black',
                border: '2px solid rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            EXPLORE CAMPUS
          </Button>
        </Box>
      </Box>

      {/* Keyframes for blinking */}
      <style>
        {`
          @keyframes fadeBlink {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

export default Home;
