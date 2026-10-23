// map.styles.js
import { styled } from '@mui/material/styles';

export const MapContainer = styled('div')(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
}));

export const EventOverlay = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: 320,
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
    zIndex: 10,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));
