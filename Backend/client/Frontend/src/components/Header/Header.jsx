import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import {
  AppBar, IconButton, Box, Menu, MenuItem, Tooltip, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RoomIcon from '@mui/icons-material/Room';

import {
  ToolbarStyled,
  Title,
  SearchContainer,
  SearchIconWrapper,
  StyledInputBase,
  StyledNavButton,
} from './header.styles';

const Header = ({
  isLoggedIn,
  onLogout,
  darkMode,
  setDarkMode,
  recenterToUser,
  goToProfile,
  profilePicture,
  handleNavToDestination,
  selectedDestination // <-- new prop
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavClick = () => {
    if (selectedDestination) {
      handleNavToDestination(selectedDestination);
    } else {
      alert("Please select a destination first.");
    }
  };

  return (
    <AppBar
      position="absolute"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
        zIndex: 1000,
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(33, 33, 33, 0.3)'
          : 'rgba(255, 255, 255, 0.2)',
        transition: 'background-color 0.9s ease',
      }}
    >
      <ToolbarStyled>
        <Box display="flex" alignItems="center" style={{ flexGrow: 1, justifyContent: 'center', textAlign: 'center' }}>
          {!isLoggedIn && (
            <Title variant="h6" noWrap component="div"
              sx={{ paddingLeft: '20px', color: (theme) => theme.palette.primary.main }}
              style={{
                fontFamily: 'Google Sans, sans-serif',
                fontWeight: 700,
                fontSize: '2rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1rem',
                textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
                paddingLeft: '30px',
                textAlign: 'center',
                margin: '0 auto',
                display: 'flex',
              }}
            >
              Hawk Nav
            </Title>
          )}
        </Box>

        <Box display="flex" alignItems="center">
          {isLoggedIn && (
            <StyledNavButton onClick={handleNavClick}>
              Nav
            </StyledNavButton>
          )}
        </Box>

        <Box display="flex" alignItems="left">
          {isLoggedIn && (
            <Autocomplete>
              <SearchContainer
                sx={{
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(33, 33, 33, 0.8)'
                    : 'rgba(128, 128, 128, 0.22)',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(33, 33, 33, 0.9)'
                      : 'rgba(128, 128, 128, 0.3)',
                  },
                  borderRadius: 4,
                  transition: 'background-color 0.9s ease',
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" />
              </SearchContainer>
            </Autocomplete>
          )}

          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit"
            sx={{
              ml: 2,
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {isLoggedIn && (
            <IconButton color="inherit" onClick={recenterToUser} sx={{
              ml: 2,
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            }}>
              <RoomIcon />
            </IconButton>
          )}

          {isLoggedIn && (
            <Box ml={2}>
              <Tooltip title="User Options">
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                  <Avatar
                    src={profilePicture || '/Assets/profile.png'}
                    alt="Profile"
                    sx={{ width: 36, height: 36 }}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { goToProfile(); handleMenuClose(); }}>View Profile</MenuItem>
                <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </ToolbarStyled>
    </AppBar>
  );
};

export default Header;
