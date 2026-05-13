import { Navigate } from "react-router-dom";
import { RootMenu } from "./rootMenu";
import { MENU } from "@/components/constants/menuCode";
import PageDashboardFB from "@/features/qc_dashboard/PageDashboardFB";
import PageDashboardACC from "@/features/qc_dashboard/PageDashboardACC";
import PageDashboard from "@/features/qc_dashboard/PageDashboard";
import { PageDashboardCTQ } from "@/features/qc_dashboard/PageDashboardCTQ";

// ⚙️ Cấu hình route
export const publicRoutes = [
    {
        path: "/",
        element: <RootMenu />,
        children: [
            { index: true, element: <Navigate to={ `${MENU.ROUTES.DASHBOARD_CTQ}/99` } replace /> },
            { path: "*", element: <Navigate to={ `${MENU.ROUTES.DASHBOARD_CTQ}/99` } replace /> },
            { path: "", element: <Navigate to={ `${MENU.ROUTES.DASHBOARD_CTQ}/99` } replace /> },

            {
                path: MENU.ROUTES.DASHBOARD_FB,
                children: [
                    { path: ":id", element: <PageDashboardFB /> },
                ],
            },
            {
                path: MENU.ROUTES.DASHBOARD_ACC,
                children: [
                    { path: ":id", element: <PageDashboardACC /> },
                ],
            },
            {
                path: MENU.ROUTES.DASHBOARD,
                children: [
                    { path: ":id", element: <PageDashboard /> },
                ],
            },
            {
                path: MENU.ROUTES.DASHBOARD_CTQ,
                children: [
                    { path: ":id", element: <PageDashboardCTQ /> },
                ],
            },
        ],
    },
];
