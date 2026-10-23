// This component handles login functionality.
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
    AuthContainer,
    FormWrapper,
    StyledTextField,
    SubmitButton,
    LinkButton,
} from './login.styles';


const Login = ({ onLogin, goToRegister, goToForgotPassword }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
                setError(data.message || 'Login failed.');
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('name', data.user.name || '');
                localStorage.setItem('email', data.user.email || '');

                onLogin();
            }
        } catch (err) {
            console.error('Network/Fetch error:', err);
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
            }}
        >
            <Box display="flex" alignItems="center">
                <img src="/Assets/logo.png" alt="Logo"
                    style={{
                        height: '80px',
                        marginRight: '10px',
                        opacity: 0.8,
                    }}
                />
            </Box>

            {error && (
                <Typography color="error" style={{ marginBottom: '16px' }}>
                    {error}
                </Typography>
            )}

            <FormWrapper onSubmit={handleSubmit}>
                <StyledTextField

                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <StyledTextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <SubmitButton type="submit" variant="contained" fullWidth>
                    Login
                </SubmitButton>

                <LinkButton type="button" onClick={goToRegister} variant="text" fullWidth>
                    Register
                </LinkButton>
                <LinkButton type="button" onClick={goToForgotPassword} variant="text" fullWidth>
                    Forgot Password?
                </LinkButton>

            </FormWrapper>
        </AuthContainer>
    );
};

export default Login;
