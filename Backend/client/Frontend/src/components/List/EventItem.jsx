import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import useStyles from './list.styles';
import { cancelEventOnGoogleCalendar } from './utils/googleCalender';

const EventItem = ({ event, setCoordinates, handleDelete, setDestination }) => {
  const classes = useStyles();
  const formattedDate = new Date(event.date).toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleGetDirections = () => {
    setCoordinates(event.coordinates);
    setDestination(event.coordinates);
    alert("Destination set! Now tap 'Nav' to begin navigation.");
  };

  return (
    <Card
      elevation={4}
      sx={{
        margin: 2,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(33, 33, 33, 0.7)'
          : 'rgba(255, 255, 255, 0.7)',
        transition: 'background-color 0.9s ease',
      }}
    >
      {event.image && (
        <CardMedia
          component="img"
          height="160"
          image={event.image}
          alt={event.name}
          className={classes.media}
        />
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {event.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {event.description}
        </Typography>

        <Stack spacing={0.5} mt={1} mb={2}>
          {event.host && (
            <Typography variant="body2">
              <strong>Host:</strong> {event.host}
            </Typography>
          )}
          {event.department && (
            <Typography variant="body2">
              <strong>Department:</strong> {event.department}
            </Typography>
          )}
          {event.date && (
            <Typography variant="body2">
              <strong>Date/Time:</strong> {formattedDate}
            </Typography>
          )}
        </Stack>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setCoordinates(event.coordinates)}
          >
            View on Map
          </Button>

          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleGetDirections}
          >
            Get Directions
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(event._id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventItem;
