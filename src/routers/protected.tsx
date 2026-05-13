import { RootMenu } from "@/routers/rootMenu.tsx";
import { Navigate } from "react-router-dom";

export const useProtectedRoutes = () => {
    const routes = [
        {
            path: '',
            element: <RootMenu />,
            children: [
                { path: '*', element: <Navigate to="." replace /> },
            ],
        },
    ];

    return routes;
};