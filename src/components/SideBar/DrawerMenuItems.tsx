import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppTitle } from "@/hooks/app/useAppTitle.ts";
import useLocalization from "@/hooks/app/useLocalization.ts";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PieChartIcon from '@mui/icons-material/PieChart';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { MENU } from "../constants/menuCode";
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { QcRouter } from "@/routers/router_qc_dashboard/qc_router";
import TimelineIcon from '@mui/icons-material/Timeline';

interface DrawerMenuItems {
    id?: any;
    text: string;
    icon?: React.ReactElement;
    path: string;
    subitems?: DrawerMenuItems[];
}

interface Props {
    isDrawerOpen: boolean;
    openCollapse: any;
    toggleCollapse: (key: any) => void
}

const commonBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: 300,
    fontSize: 14,
};

const boxStyles = {
    selected: {
        ...commonBoxStyle,
        color: '#1FC135',
        fontWeight: 600,
    },
    notSelected: commonBoxStyle,
};
interface SUBCON {
    id: number;
    department: string;
}
export default function DrawerListMenuItem({ isDrawerOpen, openCollapse, toggleCollapse }: Props) {
    const { selectedIndex, setSelectedIndex, lsSubCon } = useAppTitle();
    const { t } = useLocalization()

    const subConMenuItems: DrawerMenuItems[] = lsSubCon.map((item: SUBCON) => ({
        id: item.id ?? 0,
        text: item.department,
        path: MENU.ROUTES.DASHBOARD,
    }));

    const isParentActive = (item: DrawerMenuItems) => {
        if (!item.subitems) return false;
        return item.subitems.some(sub => sub.id === selectedIndex);
    };

    const isItemActive = (item: DrawerMenuItems) => {
        // CTQ
        if (item.id === 'CTQ') {
            return selectedIndex === 99 || selectedIndex === 100;
        }

        // SUBCON
        if (item.id === 'SUBCON') {
            return item.subitems?.some(sub => sub.id === selectedIndex) ?? false;
        }

        // normal
        return selectedIndex === item.id;
    };
    const items: DrawerMenuItems[] = [
        /*{
            id: 11,
            text: "Fabric WH",
            icon: <DashboardRoundedIcon sx={{ color: selectedIndex === 11 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD_FB,
        },
        {
            id: 12,
            text: "ACC WH",
            icon: <LineStyleIcon sx={{ color: selectedIndex === 12 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD_ACC,
        },
        {
            id: 1,
            text: "CUTTING",
            icon: <LineAxisIcon sx={{ color: selectedIndex === 1 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 2,
            text: "HEAT",
            icon: <DashboardCustomizeIcon sx={{ color: selectedIndex === 2 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 3,
            text: "EMB (A1A)",
            icon: <AutoGraphIcon sx={{ color: selectedIndex === 3 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 4,
            text: "PAD PRINT",
            icon: <PivotTableChartIcon sx={{ color: selectedIndex === 4 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 5,
            text: "BONDING",
            icon: <LeaderboardOutlinedIcon sx={{ color: selectedIndex === 5 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 'SUBCON',
            text: 'SUBCON',
            icon: <StackedBarChartIcon sx={{ color: selectedIndex === 0 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
            subitems: subConMenuItems
        },
        {
            id: 9,
            text: "SEWING LINE - INLINE",
            icon: <TrendingUpIcon sx={{ color: selectedIndex === 9 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 8,
            text: "SEWING LINE - ENDLINE",
            icon: <TrendingDownIcon sx={{ color: selectedIndex === 8 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },
        {
            id: 10,
            text: "FINAL",
            icon: <PieChartIcon sx={{ color: selectedIndex === 10 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD,
        },*/
        {
            id: 'CTQ',
            text: "CTP, CTQ DEFECT ANALYSIS",
            icon: <TimelineIcon sx={{ color: selectedIndex === 99 || selectedIndex === 100 ? "#FFF" : "#989FB0" }} />,
            path: MENU.ROUTES.DASHBOARD_CTQ,
            subitems: [
                {
                    id: 99,
                    text: 'QC INLINE',
                    path: MENU.ROUTES.DASHBOARD_CTQ,
                },
                {
                    id: 100,
                    text: 'QC ENDLINE',
                    path: MENU.ROUTES.DASHBOARD_CTQ,
                }
            ]
        },
    ];
    const navigate = useNavigate();

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: DrawerMenuItems,
    ) => {
        event.preventDefault();
        setSelectedIndex(item.id);

        if (item.path === MENU.ROUTES.DASHBOARD_FB) {
            QcRouter.goToDashboardFB(navigate, item.id ?? 0);
        } else if (item.path === MENU.ROUTES.DASHBOARD_ACC) {
            QcRouter.goToDashboardACC(navigate, item.id ?? 0);
        } else if (item.path === MENU.ROUTES.DASHBOARD_CTQ) {
            QcRouter.goToDashboardCTQ(navigate, item.id ?? 0);
        } else if (item.path === MENU.ROUTES.DASHBOARD) {
            QcRouter.goToDashboard(navigate, item.id ?? 0);
        }
    };

    const getIconStyle = (item: DrawerMenuItems) => {
        const active = isItemActive(item);

        return {
            fontSize: 32,
            color: active ? "#FFF" : "#989FB0",
            strokeWidth: active ? 1 : undefined,
        };
    };

    const renderListItemButton = (item: DrawerMenuItems, index: any, isSubitem = false, isLastSubitem = false) => {
        const isSelected =
            selectedIndex === item.id ||
            (!isSubitem && isParentActive(item));
        const isCheckSelected = item.subitems?.length ?? 0;
        return <ListItemButton
            // selected={selectedIndex === index}
            sx={{
                pl: isSubitem ? 9 : 0,
                position: "relative",
                paddingTop: isSubitem ? 0 : 1,
                paddingBottom: isSubitem ? 0 : 1,
                minHeight: '48px',
                '&:hover': {
                    backgroundColor: isSubitem ? 'unset' : '',
                },
                // backgroundColor: '#FFFFFF !important'
            }}
            disableRipple={isSubitem ? true : false}
            disableTouchRipple={isSubitem ? true : false}
            onClick={(event) => {
                if (isSubitem || isCheckSelected === 0) {
                    handleListItemClick(event, item);
                }
            }}
        >
            {isSubitem && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 35,
                        top: 0,
                        bottom: isLastSubitem ? "50%" : 0,
                        borderLeft: "1px solid #ccc",
                    }}
                />
            )}
            {isSubitem && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 35,
                        top: "50%",
                        width: 8,
                        borderTop: "1px solid #ccc",
                    }}
                />
            )}
            {item.icon && (
                <ListItemIcon
                    sx={{
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        mr: 1,
                        ml: 1,
                        justifyContent: 'center',
                        background: isSelected ? (theme) => theme.color.primary.o5 : 'transparent',
                        color: (theme) => isSelected ? theme.color.primary.o6 : theme.color.text.o5,
                        padding: 1,
                        borderRadius: 2
                    }}>
                    {React.cloneElement(item.icon as React.ReactElement, {
                        sx: {
                            ...(item.icon.props.sx || {}),
                            ...getIconStyle(item),
                        },
                    })}
                </ListItemIcon>
            )}

            {isDrawerOpen && (
                <Box
                    sx={{
                        width: '100vw',
                        backgroundColor: isSubitem && selectedIndex === item.id
                            ? (theme) => theme.color.neutral.o2
                            : "",
                        padding: '15px 20px',
                        borderRadius: '4px',
                        ml: -2,
                    }}
                >
                    <Typography
                        color={(theme) =>
                            isSubitem && selectedIndex === item.id
                                ? theme.color.neutral.o9
                                : isSelected
                                    ? theme.color.primary.o6
                                    : theme.color.neutral.o5
                        }
                        sx={{
                            opacity: isDrawerOpen ? 1 : 0,
                            fontSize: 15,
                            ml: -1,
                            fontWeight: isSubitem && selectedIndex === item.id
                                ? 700
                                : isSelected
                                    ? 700
                                    : 500,
                        }}
                    >
                        {item.text}
                    </Typography>
                </Box>
            )}
            {/* {item.subitems && (
                <Box sx={{ alignItems: "right" }}>
                    {openSubmenu[item.text] ? <ExpandLess /> : <ExpandMore />}
                </Box>
            )} */}
        </ListItemButton>
    };
    return (
        <List>
            {items?.map((item, index) => (
                <React.Fragment key={index}>
                    <ListItem
                        disablePadding
                        sx={{ display: "flex", justifyContent: "center" }}
                        onClick={() => item.subitems && toggleCollapse(item.id)}
                    >
                        {renderListItemButton(item, item.path)}
                    </ListItem>
                    {item.subitems && (
                        <Collapse
                            in={!!openCollapse[item.id] && isDrawerOpen}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                {item.subitems
                                    .map((subitem, subIndex) => (
                                        <ListItem
                                            key={subIndex}
                                            disablePadding
                                        >
                                            {renderListItemButton(
                                                subitem,
                                                subitem.path,
                                                true,
                                                subIndex === item.subitems!.length - 1
                                            )}
                                        </ListItem>
                                    ))}
                            </List>
                        </Collapse>
                    )}
                </React.Fragment>
            ))}
        </List>
    );
}
