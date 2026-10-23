import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
    getAllEvents,
    getEvent,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from '../controllers/event.controller.js';

const router = express.Router();

// Setup uploads directory if not exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

// Routes using controllers
router.get('/', getAllEvents);
router.get('/:id', getEvent, getEventById);
router.post('/', upload.single('image'), createEvent);
router.patch('/:id', getEvent, updateEvent);
router.delete('/:id', getEvent, deleteEvent);

export default router;