import {
    Avatar,
    Badge,
    Box,
    CSSObject,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slide,
    Stack,
    styled,
    Switch,
    Theme,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { MenuOpen, MenuOutlined, NotificationsOutlined } from "@mui/icons-material";
import LogoKadex from "@/assets/logo_kadex.svg?react";
import { ContentLayout } from "@components/Layout/ContentLayout";
import { faker } from "@faker-js/faker/locale/vi";
import DrawerListMenuItem from "@components/SideBar/DrawerMenuItems";
import { AppBar } from "@components/AppBar/AppBar";
import { memo, useCallback, useEffect, useState } from "react";
import { useAppTitle } from "@/hooks/app/useAppTitle.ts";
import { useLoading } from "@/utils/context/LoadingProvider.tsx";
import useLocalization from "@/hooks/app/useLocalization";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { useThemeContext } from "@/utils/context/ThemeContextProvider";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { VERSION } from "../constants/version";
import useFullScreen from "@/hooks/feature_shared/useFullScreen";
import { MaterialUISwitch } from "../Field/MaterialUISwitch";
import { LANGUAGES } from "../constants/language";
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { MENU } from "../constants/menuCode";
import { useApiGet } from "@/hooks/app/useApiGet";

interface DrawerSideBarProps {
    isOpen: boolean;
    toggle: () => void;
    children: React.ReactNode;
}

interface DrawerHeaderProps {
    isOpen: boolean;
}

const drawerWidth = 288;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    borderColor: theme.color.background.o5,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    borderColor: theme.color.background.o5,
    width: `calc(${theme.spacing(9)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: 72,
    },
    [theme.breakpoints.down('sm')]: {
        width: 0, // điện thoại
    },
});

const DrawerHeader = styled('div')<DrawerHeaderProps>(({ theme, isOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isOpen ? 'space-between' : 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const AppbarTitle = memo(() => {
    const { title } = useAppTitle()
    return <Typography variant="h6" fontWeight={'700'}>{title}</Typography>
})

const avatar = faker.image.avatar()

const AppbarSuffix = memo(() => {
    const { t } = useLocalization();
    const { mode, toggleMode } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { language, setLanguage } = useLocalization();
    const [openDialog, setOpenDialog] = useState(false);
    const { isFullScreen, toggleFullScreen } = useFullScreen();
    const handleChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const navigate = useNavigate();
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const { setLoading } = useLoading();

    const handleChangePassword = () => {
        setOpenDialog(true);
        setAnchorEl(null);
    }
    const handleOnCloseDialog = () => {
        setOpenDialog(false)
    }

    return <Stack direction={'row'} spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px' }}>
        <Typography>{VERSION}</Typography>
        <FormControl >
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                size='small'
                sx={{ width: '100px', ml: 2 }}
                value={language}
                onChange={handleChange}
            >
                {LANGUAGES.map(({ language, text, imgUrl }: any, index: number) => (
                    <MenuItem key={index} value={language} sx={{ textAlign: 'center' }}>
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '7px' }}
                        >
                            <Avatar
                                variant={'square'}
                                alt={'logo'}
                                src={imgUrl}
                                sx={{ borderRadius: '50%', width: '20px', height: '20px' }}
                            />
                            <Typography>{text}</Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormGroup>
            <FormControlLabel
                control={
                    <MaterialUISwitch
                        sx={{ ml: 4, mr: -2 }}
                        checked={mode === 'dark'}
                        onChange={toggleMode}
                    />
                }
                label=""
            />
        </FormGroup>
        <IconButton
            onClick={toggleFullScreen}
            sx={{
                width: 40,
                height: 40,
                color: (theme) => theme.color.text.o5,
            }}>
            {isFullScreen ?
                <FullscreenExitIcon sx={{ width: 35, height: 35, borderRadius: "50%" }} />
                :
                <FullscreenIcon sx={{ width: 35, height: 35, borderRadius: "50%" }} />
            }
        </IconButton>
        <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2
                }}
            >
                {/* <Avatar
                    alt="avatar"
                    src={avatar}
                    sx={{ backgroundColor: '#C7C8CC', borderRadius: '50%', width: 70, height: 70 }}
                /> */}
            </Box>
            {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
        </Menu>
    </Stack>
})

const ToggleAppbarSuffix = memo(() => {
    const { language, setLanguage, t } = useLocalization();
    const { mode, toggleMode } = useThemeContext();
    const { isFullScreen, toggleFullScreen } = useFullScreen();
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);

    const handleMenuToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{VERSION}</Typography>
                <IconButton
                    onClick={handleMenuToggle}
                    aria-controls={open ? 'settings-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={{ color: (theme) => theme.color.text.o5 }}
                >
                    <SettingsIcon />
                </IconButton>
            </Stack>

            <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{ 'aria-labelledby': 'settings-button' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 2
                    }}
                >
                    {/* <Avatar
                    alt="avatar"
                    src={avatar}
                    sx={{ backgroundColor: '#C7C8CC', borderRadius: '50%', width: 70, height: 70 }}
                /> */}
                </Box>
                <MenuItem disableRipple>
                    <FormControl fullWidth>
                        <Select
                            size="small"
                            value={language}
                            onChange={handleLanguageChange}
                            sx={{ width: '150px' }}
                        >
                            {LANGUAGES.map(({ language, text, imgUrl }: any, index: number) => (
                                <MenuItem key={index} value={language}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar
                                            src={imgUrl}
                                            alt={text}
                                            sx={{ width: 20, height: 20, borderRadius: '50%' }}
                                        />
                                        <Typography>{text}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </MenuItem>

                <MenuItem disableRipple>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <MaterialUISwitch
                                    checked={mode === 'dark'}
                                    onChange={toggleMode}
                                />
                            }
                            label={mode === 'dark' ? 'Light mode' : 'Dark mode'}
                        />
                    </FormGroup>
                </MenuItem>

                <MenuItem onClick={toggleFullScreen}>
                    <ListItemIcon sx={{ color: (theme) => theme.color.text.o5 }}>
                        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </ListItemIcon>
                    <Typography>{isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</Typography>
                </MenuItem>
                {/* <MenuItem onClick={handleLogout}>
                    <ListItemIcon sx={{ color: (theme) => theme.color.text.o5 }}><LogoutIcon /></ListItemIcon>
                    <Typography>Logout</Typography>
                </MenuItem> */}
            </Menu>

            {/* You can use your existing change password dialog */}
            {/* <ChangePasswordDialog open={openDialog} onClose={handleOnCloseDialog} /> */}
        </>
    );
});

const MemoizedAppBar = memo(({ isOpen, toggle }: { isOpen: boolean; toggle: () => void; }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openCollapse, setOpenCollapse] = useState<boolean>(isOpen);
    const handleOpen = () => {
        if (openCollapse) {
            setOpenCollapse(false)
        }
        toggle();
    }
    return (
        <AppBar position="fixed" open={isOpen} elevation={0}>
            <Toolbar className="flex items-center justify-between">
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    {!isOpen && isMobile && (
                        <IconButton onClick={handleOpen}>
                            <MenuOutlined color="primary" />
                        </IconButton>
                    )}
                    <AppbarTitle />
                </Stack>

                {!isMobile ? (
                    <AppbarSuffix />
                ) : (
                    <ToggleAppbarSuffix />
                )}
            </Toolbar>
            <Divider sx={{ borderColor: (theme) => theme.color.background.o5 }} />
        </AppBar>
    );
});

const MemoizedDrawer = memo(({ isOpen, toggle }: {
    isOpen: boolean;
    toggle: () => void;
}) => {
    const [openCollapse, setOpenCollapse] = useState<Record<any, boolean>>({});
    const toggleCollapse = (key: any) => {
        if (!isOpen) {
            toggle();
        }
        setOpenCollapse(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleOpen = () => {
        if (openCollapse) {
            setOpenCollapse({});
        }
        toggle();
    }
    return (
        <Drawer variant="permanent" open={isOpen}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

                {/* HEADER – cố định */}
                <DrawerHeader isOpen={isOpen}>
                    {isOpen && <LogoKadex />}
                    <IconButton onClick={handleOpen}>
                        {isOpen ? <MenuOpen color="primary" /> : <MenuOutlined color="primary" />}
                    </IconButton>
                </DrawerHeader>

                <Divider sx={{ borderColor: (theme) => theme.color.background.o5 }} />

                {/* CONTENT – phần này scroll */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",  // <-- CUỘN Ở ĐÂY
                        overflowX: "hidden",
                    }}
                >
                    <DrawerListMenuItem
                        isDrawerOpen={isOpen}
                        openCollapse={openCollapse}
                        toggleCollapse={toggleCollapse}
                    />
                </Box>

                {/* COPYRIGHT – cố định */}
                {isOpen && (
                    <Box
                        sx={{
                            padding: 2,
                            textAlign: "left",
                            marginTop: "auto",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: (theme) => theme.color.text.o5,
                            }}
                        >
                            Copyright © Trax Group. All rights reserved.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Drawer>
    )
});


export default function DrawerBar({ isOpen, toggle, children }: DrawerSideBarProps) {
    const Content = (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
        }}>
            <MemoizedAppBar isOpen={!isOpen} toggle={toggle} />
            <MemoizedDrawer isOpen={!isOpen} toggle={toggle} />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 2,
                    mr: 2,
                    overflow: 'hidden',
                    minHeight: 0
                }}
            >
                <DrawerHeader isOpen={isOpen} />
                <ContentLayout>
                    {children}
                </ContentLayout>
            </Box>
        </Box>
    );

    return Content;
}