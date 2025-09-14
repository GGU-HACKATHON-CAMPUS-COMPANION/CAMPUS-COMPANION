import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { MenuBookOutlined, ApartmentOutlined, PublicOutlined, NotificationsOutlined, PersonOutlined, EventOutlined } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AnimatedNumber({ target, duration = 2000 }) {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const increment = target / (duration / 50);
    const timer = setInterval(() => {
      setCurrent(prev => {
        if (prev >= target) {
          clearInterval(timer);
          return target;
        }
        return Math.min(prev + increment, target);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={setRef}>{Math.floor(current)}</span>;
}

function Home() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        {/* Video */}
        <video
          src="https://ggu.edu.in//wp-content//uploads//2025//05//Website-Video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"

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

        {/* Descriptive Tagline */}
        <Typography
          sx={{
            mt: 3,
            fontSize: '1.1rem',
            maxWidth: '600px',
            mx: 'auto',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Campus Companion is your AI-powered hub for academics, events, and student life —
          designed to keep you connected, always.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            onClick={() => navigate('/login')}
            sx={{
              background: 'white',
              color: 'black',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
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
              borderRadius: '2px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
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
      
      {/* Tech company logos */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {[
          { symbol: null, icon: '/kalvium.png' },
          { symbol: null, icon: '/IBmm.png' },
          { symbol: null, icon: '/kpmg.png' },
          { symbol: null, icon: '/tech.png' }
        ].map((company, index) => (
          <Box
            key={index}
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'white',
              marginLeft: index > 0 ? '-15px' : '0',
              zIndex: 4 - index,
              border: '2px solid rgba(255,255,255,0.3)',
              backgroundImage: company.icon ? `url(${company.icon})` : 'none',
              backgroundSize: '50%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          >
            {company.symbol}
          </Box>
        ))}
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '2rem', fontWeight: 700, ml: -1 }}>++</Typography>
      </Box>
      
      {/* Sub text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '400px',
          lineHeight: 1.6,
          textAlign: 'left',
        }}
      >
        Start your journey with a personalized campus guide to schedules, events, and resources —
        everything you need in one place.
      </Typography>

      </Box>
      
      {/* About Section */}
      <Box sx={{ pt: 12, pb: 6, px: { xs: 2, md: 8 }, background: '#FFFFFF' }}>
        <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, mb: 6, color: '#333', textAlign: 'center' }}>
          About Godavari Global University
        </Typography>
        <Typography sx={{ color: '#666', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 8 }}>
          A premier institution dedicated to fostering innovation, academic excellence, and holistic development. Our state-of-the-art campus provides students with world-class facilities and opportunities to thrive in their chosen fields.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', maxWidth: '1200px', mx: 'auto' }}>
          <Card sx={{ flex: 1, p: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid #eee', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <MenuBookOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2 }} />
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#333', mb: 1 }}>
                <AnimatedNumber target={150} />+
              </Typography>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, mb: 2, color: '#333' }}>
                Academic Excellence
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '1rem' }}>
                Cutting-edge curriculum designed to meet industry demands and prepare students for future challenges.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, p: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid #eee', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <ApartmentOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2 }} />
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#333', mb: 1 }}>
                <AnimatedNumber target={50} />+
              </Typography>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, mb: 2, color: '#333' }}>
                Modern Infrastructure
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '1rem' }}>
                State-of-the-art facilities including smart classrooms, advanced labs, and recreational spaces.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, p: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid #eee', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <PublicOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2 }} />
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#333', mb: 1 }}>
                <AnimatedNumber target={25} />+
              </Typography>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, mb: 2, color: '#333' }}>
                Global Exposure
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '1rem' }}>
                International partnerships and exchange programs to broaden perspectives and enhance learning.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ pt: 6, pb: 12, background: '#FFFFFF' }}>
        <Box sx={{ width: '80px', height: '4px', background: '#333', mx: 'auto' }} />
      </Box>

      {/* Announcements Feature Section */}
      <Box sx={{ background: '#FFFFFF' }}>
        {/* Header Container with Background */}
        <Box sx={{
          position: 'relative',
          py: 10,
          px: { xs: 2, md: 8 },
          backgroundImage: 'url("https://images.pexels.com/photos/8251144/pexels-photo-8251144.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 70%',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Gradient Overlay */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))'
          }} />
          
          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, mb: 6, color: 'white', textAlign: 'center' }}>
              Stay Updated with Campus Announcements
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Never miss important campus updates, events, or deadlines. Our smart announcement system delivers real-time notifications directly to your dashboard, keeping you informed about everything that matters to your academic journey.
            </Typography>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 4 }}>
              From exam schedules and assignment deadlines to campus events and emergency alerts, our intelligent notification system ensures you're always in the loop.
            </Typography>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', textAlign: 'center', maxWidth: '600px', mx: 'auto', mb: 6 }}>
              Experience seamless communication with priority-based filtering and instant mobile notifications.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={() => navigate('/announcements')}
                sx={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '0px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: '0.3s',
                  '&:hover': {
                    background: 'white',
                    color: 'black'
                  }
                }}
              >
                Explore Announcements
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* Features Container */}
        <Box sx={{ py: 8, px: { xs: 2, md: 8 } }}>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', gap: 6, maxWidth: '1000px', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', flex: 1, p: 3, borderRadius: '8px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } }}>
            <NotificationsOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2, transition: 'color 0.3s ease', '&:hover': { color: '#333' } }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#333', mb: 2 }}>Real-time Updates</Typography>
            <Typography sx={{ color: '#666', fontSize: '1rem' }}>Get instant notifications for urgent announcements and campus alerts</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, p: 3, borderRadius: '8px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } }}>
            <PersonOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2, transition: 'color 0.3s ease', '&:hover': { color: '#333' } }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#333', mb: 2 }}>Personalized Feed</Typography>
            <Typography sx={{ color: '#666', fontSize: '1rem' }}>Receive announcements relevant to your courses and interests</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, p: 3, borderRadius: '8px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } }}>
            <EventOutlined sx={{ fontSize: '3rem', color: '#666', mb: 2, transition: 'color 0.3s ease', '&:hover': { color: '#333' } }} />
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#333', mb: 2 }}>Event Reminders</Typography>
            <Typography sx={{ color: '#666', fontSize: '1rem' }}>Never miss important deadlines, events, or academic milestones</Typography>
          </Box>
        </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ pt: 6, pb: 12, background: '#FFFFFF' }}>
        <Box sx={{ width: '80px', height: '4px', background: '#333', mx: 'auto' }} />
      </Box>

      {/* Schedule Feature Section */}
      <Box sx={{ background: '#FFFFFF' }}>
        <Box sx={{
          position: 'relative',
          py: 10,
          px: { xs: 2, md: 8 },
          overflow: 'hidden'
        }}>
          <video
            src="https://www.pexels.com/download/video/5096176/"
            autoPlay
            muted
            loop
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              filter: 'brightness(0.7)'
            }}
          />
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))',
            zIndex: 1
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, mb: 6, color: 'white', textAlign: 'center' }}>
              Smart Class Scheduling
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Never miss a class with our intelligent scheduling system. Get personalized timetables, conflict detection, and real-time updates for all your academic commitments.
            </Typography>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 6 }}>
              Smart conflict detection • Automatic room updates • Professor contact info • Study group coordination
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={() => navigate('/schedule')}
                sx={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '0px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: '0.3s',
                  '&:hover': {
                    background: 'white',
                    color: 'black'
                  }
                }}
              >
                View My Schedule
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ pt: 6, pb: 12, background: '#FFFFFF' }}>
        <Box sx={{ width: '80px', height: '4px', background: '#333', mx: 'auto' }} />
      </Box>

      {/* Lost & Found Feature Section */}
      <Box sx={{ background: '#FFFFFF' }}>
        <Box sx={{
          position: 'relative',
          py: 10,
          px: { xs: 2, md: 8 },
          backgroundImage: 'url("https://images.pexels.com/photos/5428829/pexels-photo-5428829.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))',
            zIndex: 1
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, mb: 6, color: 'white', textAlign: 'center' }}>
              Lost & Found Hub
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Reunite with your belongings faster than ever. Our smart lost & found system uses image recognition and location tracking to help you recover lost items quickly.
            </Typography>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 6 }}>
              Photo uploads • Location mapping • Category filtering • Instant notifications • Contact integration
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={() => navigate('/lost-found')}
                sx={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '0px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: '0.3s',
                  '&:hover': {
                    background: 'white',
                    color: 'black'
                  }
                }}
              >
                Browse Lost Items
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ pt: 6, pb: 12, background: '#FFFFFF' }}>
        <Box sx={{ width: '80px', height: '4px', background: '#333', mx: 'auto' }} />
      </Box>

      {/* Personal Plans Feature Section */}
      <Box sx={{ background: '#FFFFFF' }}>
        <Box sx={{
          position: 'relative',
          py: 10,
          px: { xs: 2, md: 8 },
          overflow: 'hidden'
        }}>
          <video
            src="https://www.pexels.com/download/video/5386816/"
            autoPlay
            muted
            loop
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              filter: 'brightness(0.7)'
            }}
          />
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))',
            zIndex: 1
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, mb: 6, color: 'white', textAlign: 'center' }}>
              Personal Study Plans
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Achieve your academic goals with personalized study plans. Track progress, set milestones, and optimize your learning journey with data-driven insights.
            </Typography>
            
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center', maxWidth: '700px', mx: 'auto', mb: 6 }}>
              Goal tracking • Progress analytics • Study reminders • Performance insights • Custom milestones
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={() => navigate('/plans')}
                sx={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '0px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  transition: '0.3s',
                  '&:hover': {
                    background: 'white',
                    color: 'black'
                  }
                }}
              >
                Create My Plan
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', mt: 10 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 6, py: 8, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 8, textAlign: { xs: 'center', md: 'left' } }}>
          
          {/* Logo Section */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, ml: { md: -8 } }}>
            <img src="/ccbg.png" alt="Campus Companion" style={{ height: '200px' }} />
          </Box>

          {/* Student Services */}
          <Box sx={{ ml: { md: 16 } }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', mb: 3 }}>STUDENT SERVICES</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography component="a" href="/contact-support" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: 'black' } }}>Contact Support</Typography>
              <Typography component="a" href="/help-center" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: 'black' } }}>Help Center</Typography>
            </Box>
          </Box>

          {/* About Section */}
          <Box sx={{ ml: { md: 16 } }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', mb: 3 }}>ABOUT</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography component="a" href="/our-mission" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: 'black' } }}>Our Mission</Typography>
              <Typography component="a" href="/privacy-policy" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: 'black' } }}>Privacy Policy</Typography>
              <Typography component="a" href="/terms-of-service" sx={{ color: '#6b7280', textDecoration: 'none', '&:hover': { color: 'black' } }}>Terms of Service</Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box sx={{ borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', px: 6, py: 4, fontSize: '0.875rem', color: '#6b7280' }}>
          <Box sx={{ flex: 1 }}></Box>
          <Typography sx={{ textAlign: 'center' }}>© 2025 Campus Companion. All rights reserved.</Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{
                mt: { xs: 3, md: 0 },
                border: '1px solid #9ca3af',
                px: 4,
                py: 2,
                borderRadius: '4px',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '0.875rem',
                textTransform: 'none',
                '&:hover': {
                  background: '#f3f4f6'
                }
              }}
            >
              ↑ BACK TO TOP
            </Button>
          </Box>
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