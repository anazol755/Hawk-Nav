// This component handles the forgot password functionality.
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
    AuthContainer,
    FormWrapper,
    StyledTextField,
    SubmitButton,
    LinkButton,
} from './login.styles';

const ForgotPassword = ({ goToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Failed to send reset link.');
            } else {
                setMessage('Reset link sent to your email.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Try again.');
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
            }}
        >
            <Box display="flex" alignItems="center">
                <img src="/Assets/logo.png" alt="Logo" style={{ height: '80px', marginRight: '10px', opacity: 0.8 }} />
            </Box>

            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="primary">{message}</Typography>}

            <FormWrapper onSubmit={handleSubmit}>
                <StyledTextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <SubmitButton type="submit" variant="contained" fullWidth>
                    Send Reset Link
                </SubmitButton>
                <LinkButton onClick={goToLogin} variant="text" fullWidth>
                    Back to Login
                </LinkButton>
            </FormWrapper>
        </AuthContainer>
    );
};

export default ForgotPassword;
