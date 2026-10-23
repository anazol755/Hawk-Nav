import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import {
    AuthContainer,
    FormWrapper,
    StyledTextField,
    SubmitButton,
    LinkButton,
} from './login.styles'; // Import styled components


const Register = ({ goToLogin }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed.');
            } else {
                setSuccess('Registration successful. Please log in.');
                setUsername('');
                setEmail('');
                setPassword('');
                setRole('student');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Network error. Please try again.');
        }
    };

    return (
        <AuthContainer
            sx={{
                backgroundColor: 'background.paper',
                bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(33, 33, 33, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                transition: 'background-color 0.9s ease',
            }}>
            <Box display="flex" alignItems="center">
                            <img src="/Assets/logo.png" alt="Logo"
                                                style={{
                                                    height: '80px',
                                                    marginRight: '10px',
                                                    opacity: 0.8,
                                                
                                            }} />
                                        </Box>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}

            <FormWrapper onSubmit={handleSubmit}>
                <StyledTextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                <StyledTextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <StyledTextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                    // if domain not @ umes.edu
                    onBlur={(e) => {
                        if (!e.target.value.endsWith('@umes.edu')) {
                            setError('Email must be a UMES email address.');
                        } else {
                            setError('');
                        }
                    }}
                    fullWidth />
                <StyledTextField label="Password"
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    // if password length < 8
                    onBlur={(e) => {
                        if (e.target.value.length < 8) {
                            setError('Password must be at least 8 characters long.');
                        } else {
                            setError('');
                        }
                    }}
                
                />
                <StyledTextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
                <StyledTextField
                    select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="student">student</MenuItem>
                    <MenuItem value="faculty">faculty</MenuItem>

                </StyledTextField>
                <SubmitButton type="submit" variant="contained" fullWidth>
                    Register
                </SubmitButton>
                <LinkButton onClick={goToLogin} variant="text" fullWidth>
                    Back to Login
                </LinkButton>
            </FormWrapper>
        </AuthContainer>
    );
}

export default Register;
