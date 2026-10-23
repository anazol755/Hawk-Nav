import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';


// Container with soft background and elevation
export const AuthContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    margin: 'auto',
    marginTop: theme.spacing(8),
    maxWidth: 420,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[4],
}));

export const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.8rem',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
}));

export const FormWrapper = styled('form')(({ theme }) => ({
    width: '100%',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1.5),
    },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontWeight: 500,
    boxShadow: theme.shadows[2],
    textTransform: 'none',
}));

export const LinkButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    textTransform: 'none',
    color: theme.palette.text.secondary,
}));
