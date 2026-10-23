import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Typography, Paper, Box } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { MapContainer, EventOverlay } from './map.styles';
import useDirections from '../hooks/useDirections';
import AddToCalendarButton from '../Calender/Calender';

const UserLocationMarker = ({ heading }) => (
  <div style={{
    transform: `rotate(${heading}deg)`,
    transformOrigin: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <NavigationIcon style={{ color: 'blue', fontSize: 30 }} />
  </div>
);

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  events = [],
  setDestination,
  setMapInstance,
  setMapApi,
  mapInstance,
  mapApi,
}) => {
  const umesCoordinates = { lat: 38.168, lng: -75.696 };
  const [userLocation, setUserLocation] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [userHeading, setUserHeading] = useState(0);
  const [mapType, setMapType] = useState(() => localStorage.getItem('mapType') || 'roadmap');
  const [showEvents, setShowEvents] = useState(() => {
    const stored = localStorage.getItem('showEvents');
    return stored ? JSON.parse(stored) : true;
  });

  const { drawRoute } = useDirections({ mapInstance, mapApi });

  useEffect(() => {
    localStorage.setItem('showEvents', JSON.stringify(showEvents));
  }, [showEvents]);

  useEffect(() => {
    if (mapInstance && mapType) {
      mapInstance.setMapTypeId(mapType);
      localStorage.setItem('mapType', mapType);
    }
  }, [mapInstance, mapType]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };

          if (heading !== null && !isNaN(heading)) {
            setUserHeading(heading);
          } else if (lastPosition) {
            setUserHeading(calculateHeading(lastPosition, newPosition));
          }

          setUserLocation(newPosition);
          setLastPosition(newPosition);
          setCoordinates?.(newPosition);
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
      );
    }
  }, [lastPosition, setCoordinates]);

  const calculateHeading = (start, end) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;
    const dLon = toRad(end.lng - start.lng);
    const lat1 = toRad(start.lat);
    const lat2 = toRad(end.lat);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = Math.atan2(y, x);
    return (toDeg(brng) + 360) % 360;
  };

  const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  };

  return (
    <MapContainer>
      {/* Map Type Selector */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          zIndex: 10,
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(33, 33, 33, 0.6)'
            : 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          boxShadow: 2,
          padding: 1,
        }}
      >
        <Typography variant="body2" gutterBottom>Map Type</Typography>
        <select
          value={mapType}
          onChange={(e) => {
            setMapType(e.target.value);
            if (mapInstance) {
              mapInstance.setMapTypeId(e.target.value);
            }
          }}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="roadmap">Roadmap</option>
          <option value="satellite">Satellite</option>
          <option value="hybrid">Hybrid</option>
          <option value="terrain">Terrain</option>
        </select>
      </Box>

      {/* Google Map */}
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={umesCoordinates}
        center={userLocation || umesCoordinates}
        defaultZoom={19}
        options={mapOptions}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          setMapInstance(map);
          setMapApi(maps);
          map.setMapTypeId(mapType);
        }}
        onChange={(e) => {
          setCoordinates?.({ lat: e.center.lat, lng: e.center.lng });
          setBounds?.({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
      >
        {userLocation && (
          <UserLocationMarker
            lat={userLocation.lat}
            lng={userLocation.lng}
            heading={userHeading}
          />
        )}
      </GoogleMapReact>

      {/* Toggle Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 90,
          right: showEvents ? { xs: 10, sm: 270 } : 10,
          zIndex: 11,
          opacity: showEvents ? 1 : 0.5,
          transition: 'all 0.4s ease',
        }}
      >
        <button
          onClick={() => setShowEvents(!showEvents)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: '#800000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {showEvents ? 'Hide Events' : 'Show Events'}
          {showEvents ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </button>
      </Box>

      {/* Event Overlay Panel */}
      <EventOverlay
        sx={{
          position: 'absolute',
          top: { xs: 'unset', sm: 90 },
          bottom: { xs: 0, sm: 'unset' },
          right: 0,
          width: { xs: '100vw', sm: 250 },
          height: { xs: '40vh', sm: 'auto' },
          overflowY: 'auto',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(33, 33, 33, 0.3)'
            : 'rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.4s ease, background-color 0.9s ease',
          transform: {
            xs: showEvents ? 'translateY(0)' : 'translateY(100%)',
            sm: showEvents ? 'translateX(0)' : 'translateX(110%)',
          },
          zIndex: 10,
        }}
      >
        <Typography variant="h6" sx={{ p: 1 }}>Events</Typography>
        {events.length === 0 ? (
          <Typography sx={{ p: 2 }}>No events found</Typography>
        ) : (
          events.map((event, idx) => (
            <Paper key={idx} elevation={2} style={{ padding: '10px', margin: '8px' }}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
              )}
              <Typography variant="subtitle1">{event.name}</Typography>
              <Typography variant="body2">{event.date}</Typography>
              <Typography variant="body2">{event.building}</Typography>
              <Typography variant="body2">{event.description}</Typography>
              <button
                onClick={() => {
                  if (userLocation) {
                    drawRoute(userLocation, event.coordinates);
                    setDestination(event.coordinates);
                    if (window.innerWidth < 600) setShowEvents(false);
                  } else {
                    alert("User location not available yet.");
                  }
                }}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: '#4caf50',
                  color: '#fff'
                }}
              >
                Get Directions
              </button>
              <AddToCalendarButton event={event} />
            </Paper>
          ))
        )}
      </EventOverlay>
    </MapContainer>
  );
};

export default Map;
