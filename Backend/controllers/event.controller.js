import Event from '../models/event.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Middleware to get an event by ID
export async function getEvent(req, res, next) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.event = event;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // attach user to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
// Middleware to check if the user is the creator of the event
export const checkEventCreator = async (req, res, next) => {
    if (req.user._id.toString() !== req.event.createdBy.toString()) {
        return res.status(403).json({ message: 'Unauthorized to modify this event' });
    }
    next();
}
// Get all events
export async function getAllEvents(req, res) {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get one event
export function getEventById(req, res) {
    res.json(res.event);
}

// Create an event
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      building,
      createdBy,
      date,
      host
    } = req.body;

    // Parse coordinates from JSON string
    const coordinates = JSON.parse(req.body.coordinates || '{}');
    console.log("Parsed coordinates on backend:", coordinates);

    const newEvent = new Event({
      name,
      description,
      building,
      coordinates,
      date,
      host,
      createdBy,
      image: req.file?.path || ''
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};



// Update an event
export async function updateEvent(req, res) {
    if (req.body.name != null) {
        res.event.name = req.body.name;
    }
    if (req.body.date != null) {
        res.event.date = req.body.date;
    }
    if (req.body.location != null) {
        res.event.location = req.body.location;
    }
    if( req.body.host != null) {
        res.event.host = req.body.host;
    }

    try {
        const updatedEvent = await res.event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        // Find the event by ID
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        

        // Delete the event
        await event.deleteOne();

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error });
    }
};
export const saveGoogleEventId = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.googleEventId = req.body.googleEventId;
        await event.save();

        res.status(200).json({ message: 'Google event ID saved.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save Google event ID.', error });
    }
};