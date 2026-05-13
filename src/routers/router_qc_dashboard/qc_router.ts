import { NavigateFunction } from "react-router-dom";

const goToDashboardFB = (navigate: NavigateFunction, id: number) => {
    if (location.pathname.includes('dashboard_fb')) {
        navigate(`dashboard_fb/${id}`)
    } else navigate(`dashboard_fb/${id}`)
}

const goToDashboardACC = (navigate: NavigateFunction, id: number) => {
    if (location.pathname.includes('dashboard_acc')) {
        navigate(`dashboard_acc/${id}`)
    } else navigate(`dashboard_acc/${id}`)
}

const goToDashboard = (navigate: NavigateFunction, id: number) => {
    if (location.pathname.includes('dashboard')) {
        navigate(`dashboard/${id}`)
    } else navigate(`dashboard/${id}`)
}

const goToDashboardCTQ = (navigate: NavigateFunction, id: number) => {
    if (location.pathname.includes('dashboard_ctq')) {
        navigate(`dashboard_ctq/${id}`)
    } else navigate(`dashboard_ctq/${id}`)
}
export const QcRouter = {
    goToDashboardFB,
    goToDashboardACC,
    goToDashboard,
    goToDashboardCTQ
}