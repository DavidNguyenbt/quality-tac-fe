import { useNavigationTiming } from "@/hooks/app/useNavigationTiming.ts";
import DrawerBar from "../components/SideBar/DrawerBar.tsx";
import {useDisclosure} from "../hooks/app/useDisclosure.ts";
import {Outlet} from "react-router-dom";

export function RootMenu() {
    const {isOpen, toggle} = useDisclosure(true);
    useNavigationTiming();
    return <DrawerBar isOpen={isOpen} toggle={toggle}>
        <Outlet/>
    </DrawerBar>
}