import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { } from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
    interface Theme {
        color: {
            primary: {
                o1: string;
                o2: string;
                o3: string;
                o4: string;
                o5: string;
                o6: string;
                o7: string;
                o8: string;
                o9: string;
                o10: string;
            },
            neutral: {
                o1: string;
                o2: string;
                o3: string;
                o4: string;
                o5: string;
                o6: string;
                o7: string;
                o8: string;
                o9: string;
                o10: string;
            },
            text: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
                o11?: string;
                o12?: string;
                o13?: string;
                o14?: string;
                o15?: string;
            },
            background: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
                o11?: string;
                o12?: string;
                o13?: string;
                o14?: string;
                o15?: string;
            };
        }
    }

    interface ThemeOptions {
        color?: {
            primary?: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
            },
            neutral?: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
            },
            text?: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
                o11?: string;
                o12?: string;
                o13?: string;
                o14?: string;
                o15?: string;
            },
            background?: {
                o1?: string;
                o2?: string;
                o3?: string;
                o4?: string;
                o5?: string;
                o6?: string;
                o7?: string;
                o8?: string;
                o9?: string;
                o10?: string;
                o11?: string;
                o12?: string;
                o13?: string;
                o14?: string;
                o15?: string;
            };
        }
    }
}

interface ThemeContextProps {
    toggleMode: () => void;
    mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(
        () => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light'
    );

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode);
            return newMode;
        });
    };

    const theme = useMemo(() => {
        return createTheme({
            color: {
                primary: {
                    o1: '#F1F8E8',
                    o2: '#DBEDC4',
                    o3: '#C3E09F',
                    o4: '#ABD478',
                    o5: '#39B54A',
                    o6: '#27A338',
                    o7: '#1C982D',
                    o8: '#0D891E',
                    o9: '#027C11',
                    o10: '#007005'
                },
                neutral: {
                    o1: '#FFFFFF',
                    o2: '#F6F6FA',
                    o3: '#D2D6DE',
                    o4: '#B5BBC6',
                    o5: '#989FB0',
                    o6: '#828B9E',
                    o7: '#6C778D',
                    o8: '#5E697C',
                    o9: '#1B2722',
                    o10: '#070D14'
                },
                text: {
                    o1: mode === 'light' ? '#1B2722' : '#FFFFFF',
                    o2: mode === 'light' ? '#B6820A' : '#D4A233',
                    o3: mode === 'light' ? '#1976d2' : '#3D7DFF',
                    o4: mode === 'light' ? '#E6352B' : '#FF6B5E',
                    o5: mode === 'light' ? '#989FB0' : '#FFFFFF',
                    o6: mode === 'light' ? '#0D891E' : '#18A32A',
                    o7: mode === 'light' ? '#FFFFFF' : '#989FB0',
                    o8: mode === 'light' ? '#3B3B3B' : '#A3A3A3',
                    o9: mode === 'light' ? '#007005' : '#00A306',
                    o10: mode === 'light' ? '#FFFFFF' : '#1B2722',
                    o11: mode === 'light' ? '#97D8A0' : '#2E593A',
                    o12: mode === 'light' ? '#5E697C' : '#FFFFFF',
                    o13: mode === 'light' ? '#FAFAFA' : '#121212',
                    o14: mode === 'light' ? '#212121' : '#FFFFFF',
                    o15: mode === 'light' ? '#f0f8ff' : '#1a3b4d',
                },
                background: {
                    o1: mode === 'light' ? '#FFFFFF' : '#101316',
                    o2: mode === 'light' ? '#F5F5F9' : '#2B2B30',
                    o3: mode === 'light' ? '#E9E9ED' : '#3A3A40',
                    o4: mode === 'light' ? '#F9F9F9' : '#1A1A1A',
                    o5: mode === 'light' ? '#E0E0E0' : '#3A3A3D',
                    o6: mode === 'light' ? '#27A338' : '#1E7C2D',
                    o7: mode === 'light' ? '#DDDDE1' : '#3B3F47',
                    o8: mode === 'light' ? '#F6F6FA' : '#3A3A42',
                    o9: mode === 'light' ? '#E1F4E4' : '#2B4D3A',
                    o10: mode === 'light' ? '#E6F1E6' : '#2B4D3A',
                    o11: mode === 'light' ? '#F5FBF6' : '#2E3A30',
                    o12: mode === 'light' ? '#F8F8F8' : '#1E1E1E',
                    o13: mode === 'light' ? '#FFFFFF' : '#2B2B30',
                    o14: mode === 'light' ? '#F5F5F5' : '#2E2E2E',
                    o15: mode === 'light' ? '#c8e6c9' : '#388e3c',
                }
            },
            typography: {
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                button: {
                    textTransform: 'none',
                }
            },
            palette: {
                action: {
                    disabled: "#fff",
                    disabledBackground: '#C3E09F',
                },
                primary: {
                    main: '#39B54A',
                    contrastText: mode === 'light' ? '#101316' : '#FFFFFF'
                },
                secondary: {
                    main: '#39B54A',
                    contrastText: mode === 'light' ? '#fff' : '#101316'
                },
                background: {
                    default: mode === 'light' ? '#F5F5F9' : '#2B2B30',
                    paper: mode === 'light' ? '#FFFFFF' : '#101316',
                }
            },
            components: {
                MuiPickersDay: {
                    styleOverrides: {
                        root: ({ theme }) => ({
                            '&.Mui-selected': {
                                backgroundColor: mode === 'light' ? '#27A338' : '#1E7C2D',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? '#27A338' : '#1E7C2D',
                                },
                            },
                            '&.Mui-disabled': {
                                color: theme.palette.mode === 'light' ? '#BDBDBD !important' : '#9E9E9E !important',
                                opacity: 1,
                                pointerEvents: 'none',
                            },
                        }),
                    },
                },
                MuiDateCalendar: {
                    styleOverrides: {
                        root: {
                            marginTop: 0,
                            backgroundColor: mode === 'light' ? '#FFFFFF' : '#101316',
                            color: mode === 'light' ? '#1B2722 !important' : '#FFFFFF !important',
                            '& .MuiPickersDay-root': {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? '#f0f0f0' : '#4F4F59',
                                },
                            },
                            '& .MuiTypography-root': {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? '#f0f0f0' : '#4F4F59',
                                },
                            },
                            '& .MuiSvgIcon-root': {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                            },
                        },

                    },
                },
                MuiDataGrid: {
                    styleOverrides: {
                        overlay: {
                            color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        // root: {
                        //     "& .MuiSvgIcon-root": {
                        //         color: mode === "light" ? "#FFFFFF" : "#000",
                        //     },
                        // },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            minHeight: '48px',
                            // color: mode === 'light' ? '#FFFFFF !important' : '#101316 !important',
                            '&.MuiButton-outlined': {
                                '&:disabled': {
                                    borderColor: "#D2D6DE !important",
                                    color: "#989FB0 !important"
                                },
                            },
                            '&.MuiButton-contained': {
                                '&:disabled': {
                                    backgroundColor: '#D2D6DE',
                                    color: "#989FB0 !important"
                                },
                            },
                        }
                    }
                },
                MuiInputBase: {
                    styleOverrides: {
                        root: {
                            minHeight: '48px !important',
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            backgroundColor: mode === 'light' ? '#FFFFFF' : '#101316',
                            // border: mode === 'light' ? 'none' : `1px solid #3A3A3D`,
                            '&.Mui-disabled': {
                                color: mode === 'light' ? '#1B2722 !important' : '#FFFFFF !important',
                            },
                        },
                        input: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            '&::placeholder': {
                                color: mode === 'light' ? '#989FB0' : '#FFFFFF',
                                opacity: 1,
                            },
                            '&.Mui-disabled': {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                            },
                        }
                    },
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        input: {
                            '&.Mui-disabled': {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF',
                                '-webkit-text-fill-color': mode === 'light' ? '#1B2722' : '#FFFFFF',
                                opacity: 1,
                            },
                        },
                    }
                },
                MuiSelect: {
                    styleOverrides: {
                        icon: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                        }
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            '&.Mui-selected': {
                                backgroundColor: mode === 'light' ? '#E6F1E6' : '#2A4D32',
                            },
                            '&:hover': {
                                backgroundColor: mode === 'light' ? '#d0d0d0' : '#555555',
                                color: mode === 'light' ? '#101316' : '#FFFFFF',
                            },
                        },
                    },
                },
                MuiStepLabel: {
                    styleOverrides: {
                        label: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            '&.Mui-active': {
                                color: mode === 'light' ? '#101316' : '#FFFFFF',
                            },
                            '&.Mui-completed': {
                                color: mode === 'light' ? '#101316' : '#FFFFFF',
                            },
                        },
                    },
                },
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            '&.Mui-disabled': {
                                color: mode === 'light' ? '#1B2722 !important' : '#FFFFFF !important',
                            },
                        }
                    },
                },
                MuiAutocomplete: {
                    styleOverrides: {
                        paper: {
                            color: mode === 'light' ? '#101316' : '#FFFFFF',
                            backgroundColor: mode === 'light' ? '#FFFFFF' : '#101316',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            border: mode === 'light' ? 'none' : `1px solid #3A3A3D`,
                        },
                        noOptions: {
                            padding: '10px 20px',
                            fontStyle: 'italic',
                            color: mode === 'light' ? '#1B2722' : '#FFFFFF'
                        },
                        option: {
                            '&[aria-selected="true"]': {
                                backgroundColor: mode === 'light' ? '#F5FBF6 !important' : '#2E3A30 !important',
                            }
                        },
                    },
                },
                MuiTypography: {
                    styleOverrides: {
                        root: {
                            // color: mode === 'light' ? '#101316' : '#FFFFFF !important',
                            "&.Mui-disabled": {
                                color: mode === 'light' ? '#1B2722' : '#FFFFFF !important',
                            },
                        },
                    },
                },
            }
        });
    }, [mode]);
    const rootElement = document.documentElement;
    rootElement.style.setProperty('--background-color', theme.palette.background.default);
    return (
        <ThemeContext.Provider value={{ toggleMode, mode }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
};
