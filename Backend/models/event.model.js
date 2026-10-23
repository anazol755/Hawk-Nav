import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    building: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    date: Date,
    createdBy: String,
    host: String,
    department: String,
    image: String,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
