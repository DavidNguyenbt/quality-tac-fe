import { useLocation, useNavigate } from "react-router-dom";
import { useSignal } from "@preact/signals-react";
import { appBarTitle } from "@/utils/states/state.ts";
import { useEffect, useState } from "react";
import useLocalization from "@/hooks/app/useLocalization.ts";
import { MENU } from "@/components/constants/menuCode";
import { useApiGet } from "./useApiGet";
import { getSubcon } from "@/network/urls/qc_dashboard";

type PathItem = {
    keyword: string;
    title: string;
    order: any;
};

interface SUBCON {
    id: number;
    department: string;
}

export const useAppTitle = () => {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState<any | undefined>(undefined);
    const [lsSubCon, setLsSubCon] = useState<SUBCON[]>([]);
    const { data: listSubCon, isLoading: isLoadingSubCon } = useApiGet<any>(
        ["listSubCon"],
        () => getSubcon()
    );

    const { t } = useLocalization();
    const location = useLocation();
    const title = useSignal(appBarTitle);
    const pathItems: PathItem[] = [
        { keyword: MENU.ROUTES.DASHBOARD_FB, title: "Fabric WH", order: 11 },
        { keyword: MENU.ROUTES.DASHBOARD_ACC, title: "Acc WH", order: 12 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Cutting", order: 1 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Heat Transfer", order: 2 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Embroidery", order: 3 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Pad Print", order: 4 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Bonding", order: 5 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Innotext Sup", order: 6 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "Rega", order: 7 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "SEWING LINE - ENDLINE", order: 8 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "SEWING LINE - INLINE", order: 9 },
        { keyword: MENU.ROUTES.DASHBOARD, title: "FINAL", order: 10 },
        { keyword: MENU.ROUTES.DASHBOARD_CTQ, title: "InLine", order: 99 },
        { keyword: MENU.ROUTES.DASHBOARD_CTQ, title: "Endline", order: 100 },
    ];
    const fullPathItems: PathItem[] = [
        ...pathItems,
        ...(lsSubCon.map((item) => ({
            keyword: MENU.ROUTES.DASHBOARD,
            title: item.department,
            order: item.id,
        })))
    ];
    useEffect(() => {
        if (listSubCon) {
            setLsSubCon(listSubCon.subcon);
        }
    }, [listSubCon]);
    useEffect(() => {
        if (location.pathname === "/") {
            appBarTitle.value = "Fabric WH";
            setSelectedIndex(11);
            navigate(`${MENU.ROUTES.DASHBOARD_FB}/11`, { replace: true });
            return;
        }

        const pathSegments = location.pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        const id = Number(lastSegment);

        if (id === 99 || id === 100) {
            const ctqTitle = id === 99 ? "QC Inline CTQ, CTP Defects" : "QC Endline CTQ Defects";
            appBarTitle.value = ctqTitle;
            setSelectedIndex(id);
            return;
        }

        const matchedItem = fullPathItems.find(item => item.order === id);

        if (matchedItem) {
            appBarTitle.value = matchedItem.title;
            setSelectedIndex(matchedItem.order);
        } else {
            appBarTitle.value = "Sub Con";
            setSelectedIndex(0);
        }
    }, [location.pathname, lsSubCon]);

    return { title, selectedIndex, setSelectedIndex, lsSubCon };
};
