import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const UserProfile = ({ onLogout, onClose }) => {
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('/Assets/profile.png');
    const [userInfo, setUserInfo] = useState({
        name: '',
        username: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        const storedUser = {
            name: localStorage.getItem('name'),
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            role: localStorage.getItem('role'),
            profilePicture: localStorage.getItem('profilePicture'),
        };

        setUserInfo(storedUser);
        if (storedUser.profilePicture) {
            setPreview(storedUser.profilePicture);
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!imageFile) return alert('Please select a file');

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/upload-profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const imageUrl = response.data.imageUrl;
            setPreview(imageUrl);
            localStorage.setItem('profilePicture', imageUrl);
            alert('Profile picture uploaded!');
        } catch (error) {
            console.error('Upload failed:', error.response?.data || error.message);
            alert('Failed to upload profile picture.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/profile-picture`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPreview('/Assets/profile.png');
            localStorage.removeItem('profilePicture');
            alert('Profile picture deleted.');
        } catch (err) {
            console.error('Delete failed:', err.response?.data || err.message);
            alert('Failed to delete profile picture.');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: 'auto',
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: 'background.paper',
                mt: 5,
                position: 'relative',
                top: 90,
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'grey.600',
                }}
            >
                <CloseIcon />
            </IconButton>

            <Typography variant="h5" gutterBottom>
                Welcome, {userInfo.username}
            </Typography>

            <Typography variant="body1"><strong>Name:</strong> {userInfo.name}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {userInfo.role}</Typography>

            <Box
                component="img"
                src={preview}
                alt="Profile"
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    marginTop: 2,
                    marginBottom: 2,
                }}
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="profile-upload"
            />
            <label htmlFor="profile-upload">
                <Button variant="outlined" component="span" fullWidth>
                    Choose Image
                </Button>
            </label>

            <Stack direction="row" spacing={2} mt={2}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleUpload}
                    disabled={!imageFile}
                >
                    Upload
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </Stack>

            <Button
                variant="outlined"
                color="warning"
                onClick={onLogout}
                sx={{ mt: 3 }}
                fullWidth
            >
                Logout
            </Button>
        </Box>
    );
};

export default UserProfile;
