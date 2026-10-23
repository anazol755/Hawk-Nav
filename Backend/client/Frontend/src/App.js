import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { LoadScript } from '@react-google-maps/api';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header/Header';
import Map from './components/Map/Map';
import List from './components/List/List';
import buildingCoordinates from './components/List/buildingCoordinates';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import UserProfile from './components/Login/UserProfile';

const GOOGLE_LIBRARIES = ['places'];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 38.168, lng: -75.696 });
  const [bounds, setBounds] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [locationError, setLocationError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '/Assets/profile.png');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);

  const prevEventsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const showBackground = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#800000' },
      secondary: { main: '#808080' },
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem('role'));
      setProfilePicture(localStorage.getItem('profilePicture') || '/Assets/profile.png');
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Location error: ' + error.message);
        setCoordinates({ lat: 38.168, lng: -75.696 });
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
      const fetchedEvents = response.data.map(event => ({
        ...event,
        coordinates: event.coordinates || buildingCoordinates[event.building] || { lat: 0, lng: 0 },
        image: event.image ? `${process.env.REACT_APP_API_URL}/${event.image}` : null,
      }));

      const prevEvents = prevEventsRef.current;
      const prevIds = new Set(prevEvents.map(e => e._id));
      const newEvent = fetchedEvents.find(e => !prevIds.has(e._id));

      if (newEvent) {
        setNotification({ open: true, message: `New event added: ${newEvent.name}`, severity: 'success' });
      }
      if (prevEvents.length && fetchedEvents.length < prevEvents.length) {
        setNotification({ open: true, message: 'An event was removed.', severity: 'warning' });
      }

      prevEventsRef.current = fetchedEvents;
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserRole(localStorage.getItem('role'));
    setProfilePicture(localStorage.getItem('profilePicture') || '/Assets/profile.png');
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.clear();
    navigate('/login');
  };

  const handleNavToDestination = (destination) => {
    if (!mapInstance || !mapApi) {
      alert("Map is still loading. Please wait a moment.");
      return;
    }
    if (!destination) {
      alert("No destination selected.");
      return;
    }

    const origin = coordinates;
    const directionsService = new mapApi.DirectionsService();
    const directionsRenderer = new mapApi.DirectionsRenderer({ suppressMarkers: false });
    directionsRenderer.setMap(mapInstance);

    directionsService.route(
      {
        origin,
        destination,
        travelMode: mapApi.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === mapApi.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          alert("Failed to fetch directions.");
          console.error(status, result);
        }
      }
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showBackground && (
        <Box
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(33, 33, 33, 0.9)'
                : 'rgba(255, 255, 255, 0.7)',
            top: 0,
            left: 0,
            zIndex: -1,
            backgroundImage: `url('/Assets/Background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(1px)',
            backdropFilter: 'blur(8px)',
            transition: 'background-color 0.5s ease-in-out',
          }}
        />
      )}

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={GOOGLE_LIBRARIES}>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          profilePicture={profilePicture}
          role={userRole}
          selectedDestination={selectedDestination}
          handleNavToDestination={handleNavToDestination}
          goToProfile={() => navigate('/profile')}
          recenterToUser={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              (err) => console.error('Geo error', err),
              { enableHighAccuracy: true, timeout: 15000 }
            );
          }}
        />

        <Routes>
          <Route path="/login" element={<Box mt={10}><Login onLogin={handleLogin} goToRegister={() => navigate('/register')} goToForgotPassword={() => navigate('/forgot-password')} /></Box>} />
          <Route path="/register" element={<Box mt={10}><Register onLogin={handleLogin} goToLogin={() => navigate('/login')} /></Box>} />
          <Route path="/forgot-password" element={<Box mt={10}><ForgotPassword goToLogin={() => navigate('/login')} /></Box>} />
          <Route path="/reset-password" element={<ResetPassword goToLogin={() => navigate('/login')} />} />
          <Route path="/profile" element={<UserProfile onLogout={handleLogout} onClose={() => navigate('/')} setProfilePicture={setProfilePicture} />} />
          <Route path="/" element={
            isLoggedIn ? (
              <Box position="relative" width="100vw" height="calc(100vh - 64px)">
                {locationError && (
                  <Box sx={{ position: 'absolute', top: 70, left: 16, zIndex: 100, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="body2" color="error">{locationError}</Typography>
                    <Button variant="contained" size="small" onClick={fetchEvents} sx={{ mt: 1 }}>Retry Location</Button>
                  </Box>
                )}
                <Map
                  setCoordinates={setCoordinates}
                  setBounds={setBounds}
                  coordinates={coordinates}
                  events={events}
                  role={userRole}
                  setDestination={setSelectedDestination}
                  setMapInstance={setMapInstance}
                  setMapApi={setMapApi}
                  mapInstance={mapInstance}
                  mapApi={mapApi}
                />
                {userRole === 'faculty' && (
                  <Box position="absolute" top={96} left={16} width={{ xs: '90%', sm: 360 }} maxHeight="85vh" overflow="auto" zIndex={20} borderRadius={2} boxShadow={3} p={2}>
                    <List setCoordinates={setCoordinates} events={events} isLoading={isLoading} onEventAdded={fetchEvents} role={userRole} />
                  </Box>
                )}
              </Box>
            ) : <Navigate to="/login" />
          } />
        </Routes>

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            sx={{ width: '100%' }}
            elevation={6}
            variant="filled"
          >
            {notification.message}
          </MuiAlert>
        </Snackbar>
      </LoadScript>
    </ThemeProvider>
  );
};

export default App;
