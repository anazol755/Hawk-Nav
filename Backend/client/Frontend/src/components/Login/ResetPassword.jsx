import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
    AuthContainer,
    FormWrapper,
    StyledTextField,
    SubmitButton,
    LinkButton,
} from './login.styles';

const ResetPassword = ({ goToLogin }) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Reset failed');
            } else {
                setSuccess('Password reset successful. Please log in.');
            }
        } catch (err) {
            console.error('Reset error:', err);
            setError('Network error.');
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
            {success && <Typography color="primary">{success}</Typography>}

            <FormWrapper onSubmit={handleSubmit}>
                <StyledTextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                />
                <StyledTextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                />
                <SubmitButton type="submit" variant="contained" fullWidth>
                    Reset Password
                </SubmitButton>
                <LinkButton onClick={goToLogin} variant="text" fullWidth>
                    Back to Login
                </LinkButton>
            </FormWrapper>
        </AuthContainer>
    );
};

export default ResetPassword;
