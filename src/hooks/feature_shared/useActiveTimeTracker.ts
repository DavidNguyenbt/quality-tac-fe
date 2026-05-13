import storage from "@/utils/storage";
import { useEffect, useState } from "react";

const CHECK_INTERVAL = 1000;
const TIMEOUT_THRESHOLD = 5000;

const useActiveTimeTracker = () => {
    const [isCleared, setIsCleared] = useState(false);

    useEffect(() => {
        const updateActiveTime = () => {
            localStorage.setItem("activeTime", Date.now().toString());
        };

        const checkLastActiveTime = () => {
            const lastActive = localStorage.getItem("activeTime");
            if (lastActive && Date.now() - Number(lastActive) > TIMEOUT_THRESHOLD) {
                storage.clearToken();
                localStorage.removeItem("activeTime");
                setIsCleared(true);
            }
        };

        checkLastActiveTime();

        const interval = setInterval(updateActiveTime, CHECK_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return isCleared;
};

export default useActiveTimeTracker;
