import axios from 'axios';
import React, { useState } from 'react';
import {
  CircularProgress, Typography, Grid, Button,
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Box,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventItem from './EventItem';
import useStyles from './list.styles';
import buildingCoordinates from './buildingCoordinates';
import { cancelEventOnGoogleCalendar } from './utils/googleCalender';

const List = ({ setCoordinates, events, isLoading, onEventAdded, role, setDestination }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    building: '',
    coordinates: { lat: 0, lng: 0 },
    date: '',
    host: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleBuildingChange = (e) => {
    const building = e.target.value;
    const coords = buildingCoordinates[building];
    setNewEvent(prev => ({
      ...prev,
      building,
      coordinates: {
        lat: coords?.lat || 0,
        lng: coords?.lng || 0,
      }
    }));
  };

  const handleAddEvent = async () => {
    const username = localStorage.getItem('username');
    const formData = new FormData();

    formData.append('name', newEvent.name);
    formData.append('description', newEvent.description);
    formData.append('building', newEvent.building);
    formData.append('date', newEvent.date);
    formData.append('host', newEvent.host);
    formData.append('coordinates', JSON.stringify(newEvent.coordinates));
    formData.append('dateCreated', new Date().toISOString());
    formData.append('createdBy', username);
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (onEventAdded) onEventAdded();
      setOpen(false);
      setNewEvent({
        name: '', description: '', building: '', coordinates: { lat: 0, lng: 0 }, date: '', host: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const eventToDelete = events.find(e => e._id === eventId);

      if (eventToDelete?.googleEventId) {
        await cancelEventOnGoogleCalendar(eventToDelete.googleEventId);
      }

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`);

      if (onEventAdded) onEventAdded();
    } catch (err) {
      console.error("Error canceling or deleting event:", err);
    }
  };

  if (role !== 'faculty') {
    return null; // hide list for non-faculty users
  }

  return (
    <Box className={classes.container} position="relative">
      {/* Add Button */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: 44,
          left: 24,
          backgroundColor: '#4CAF50',
          color: 'white',
          '&:hover': { backgroundColor: '#388E3C' },
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </IconButton>

      {/* Add Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Event Name" name="name" margin="dense" onChange={handleChange} />
          <TextField fullWidth label="Description" name="description" margin="dense" onChange={handleChange} />
          <TextField fullWidth name="date" type="datetime-local" margin="dense" onChange={handleChange} />
          <TextField fullWidth label="Host" name="host" margin="dense" onChange={handleChange} />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ marginTop: '1rem' }} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Building</InputLabel>
            <Select value={newEvent.building} onChange={handleBuildingChange}>
              {Object.keys(buildingCoordinates).map((building) => (
                <MenuItem key={building} value={building}>{building}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Event List */}
      {isLoading ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <Grid container spacing={3} className={classes.listGrid}>
          {events.length ? (
            events.map((event, index) => (
              <EventItem
                key={index}
                event={event}
                setCoordinates={setCoordinates}
                handleDelete={handleDelete}
                setDestination={setDestination} // <-- added prop
              />
            ))
          ) : (
            <Typography variant="h6" sx={{ mt: 2 }}>No events found</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default List;
