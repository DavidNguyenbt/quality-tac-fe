import { styled } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    background: theme.color.background.o1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    // desktop/tablet
    ...(open
        ? {
            marginLeft: 288,
            width: `calc(100% - ${288}px)`,
        }
        : {
            marginLeft: 72,
            width: `calc(100% - ${72}px)`,
        }),
    // mobile
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        width: '100%',
    },
}));
