/// <reference types="vite-plugin-svgr/client" />

import '@/App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "@/routers/public";
import GlobalSnackbar from "@/features/shared/components/GlobalSnackbar.tsx";
import { useProtectedRoutes } from "@/routers/protected.tsx";
import storage from "@/utils/storage.ts";
import { Box } from "@mui/material";
import { useLoading } from "@/utils/context/LoadingProvider.tsx";
import { ScreenLoaderBackdrop } from "@components/Loading/ScreenLoaderBackdrop.tsx";
import { LocalizationProvider } from "@/utils/context/LocalizationProvider.tsx";
import GlobalDialog from './features/shared/components/GlobalDialog';
import useActiveTimeTracker from './hooks/feature_shared/useActiveTimeTracker';
import { BASE_URL } from './network/network';
import PageDashboardFB from './features/qc_dashboard/PageDashboardFB';
import { ErrorBoundary } from '@/lib/monitoring/ErrorBoundary';
import { DevLogPanel } from '@/lib/monitoring/DevLogPanel';

const AppRouter = () => {
    //const commonRoutes = [{ path: '/', element: <PageDashboardFB /> }];

    //const routes = publicRoutes;
    const basePath = import.meta.env.BASE_URL || '/';
    return createBrowserRouter(publicRoutes, {
        basename: basePath,
    });
    //return createBrowserRouter([...routes, ...commonRoutes], {
    //    basename: basePath
    //});
    // return createBrowserRouter([...routes, ...commonRoutes])
}


function App() {
    const { loading } = useLoading();

    return (
        <Box>
            <ScreenLoaderBackdrop open={loading} />
            <GlobalSnackbar />
            <GlobalDialog />
            <ErrorBoundary>
                <LocalizationProvider>
                    <RouterProvider router={AppRouter()} />
                </LocalizationProvider>
            </ErrorBoundary>
            {import.meta.env.DEV && <DevLogPanel/>}
        </Box>
    )
}

export default App
