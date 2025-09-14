import { Box, Typography, Button } from '@mui/material';

function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Video Section */}
      <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
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
          top: '50%',
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

        {/* Buttons + Circle */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, gap: 2 }}>
          {/* Buttons row */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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

          {/* Circle below buttons */}
            <Box className="flex items-center gap-4 mt-4">
          <Box
            className="flex justify-center  items-center bg-white/10  h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 rounded-full backdrop-blur-sm text-white font-bold"
          >
            AK
          </Box>
        
          <Box
            className="flex justify-center items-center bg-white/10 h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 rounded-full backdrop-blur-sm text-white font-bold"
          >
            MK
          </Box>
          <Box
            className="flex justify-center items-center bg-white/10 h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 rounded-full backdrop-blur-sm text-white font-bold"
          >
            HS
          </Box>
          <Box
            className="flex justify-center items-center bg-white/10 h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 rounded-full backdrop-blur-sm text-white font-bold"
          >
            KM
          </Box>
        </Box>
        <Typography className='w-[50%]'>
          Stay organized without compromising your campus experience. Our comprehensive platform is perfect for those busy university days and seamless student life.
        </Typography>
        </Box>

      </Box>
      </Box>

      {/* GGU College Section */}
      <Box sx={{ py: 8, px: 4, bgcolor: 'white', textAlign: 'center' }}>
        <Typography
  variant="h1"
  sx={{
    fontWeight: 900,
    fontSize: { xs: '4rem', sm: '6rem', md: '8rem', lg: '10rem' },
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '0.1em',
    background: 'linear-gradient(90deg, #030599, red)', // gradient colors
    WebkitBackgroundClip: 'text', // clip gradient to text
    WebkitTextFillColor: 'transparent', // make text itself transparent
  }}
>
  GGU
</Typography>

        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            color: '#064232',
            mt: 2,
            fontFamily: "'Space Grotesk', sans-serif"
          }}
        >
          GODAVARI GLOBAL UNIVERSITY
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#666', 
            mt: 3,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: '1.1rem'
          }}
        >
          Excellence in Education, Innovation in Learning
        </Typography>
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
