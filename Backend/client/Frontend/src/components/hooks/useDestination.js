import { useState, useEffect } from 'react';

const DEST_LAT_KEY = 'destinationLat';
const DEST_LNG_KEY = 'destinationLng';

const useDestination = () => {
  const [destination, setDestination] = useState(() => {
    const lat = parseFloat(localStorage.getItem(DEST_LAT_KEY));
    const lng = parseFloat(localStorage.getItem(DEST_LNG_KEY));
    return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
  });

  useEffect(() => {
    if (destination) {
      localStorage.setItem(DEST_LAT_KEY, destination.lat);
      localStorage.setItem(DEST_LNG_KEY, destination.lng);
    }
  }, [destination]);

  const clearDestination = () => {
    localStorage.removeItem(DEST_LAT_KEY);
    localStorage.removeItem(DEST_LNG_KEY);
    setDestination(null);
  };

  return { destination, setDestination, clearDestination };
};

export default useDestination;
