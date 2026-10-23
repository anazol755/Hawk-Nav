// header.styles.js
import { alpha, styled } from '@mui/material/styles';

export const ToolbarStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
}));

export const Title = styled('h5')(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 500,
  fontSize: '1.5rem',
  color: theme.palette.primary.contrastText,
  margin: 0,
}));

export const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  maxWidth: 300,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled('input')(({ theme }) => ({
  color: 'inherit',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: theme.spacing(1),
  width: '100%',
  fontSize: '1rem',
  fontFamily: 'inherit',
}));
export const StyledNavButton = styled('button')(({ theme }) => ({
  fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", Roboto, Helvetica, Arial, sans-serif',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '10px 18px',
  border: 'none',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  backgroundColor: theme.palette.mode === 'dark' ? '#2C2C2E' : '#E5E5EA',
  cursor: 'pointer',
  borderRadius: 16,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? '#1E1E1F' // darker than #2C2C2E
      : '#D4D4D8', // darker than #E5E5EA
  },
}));
