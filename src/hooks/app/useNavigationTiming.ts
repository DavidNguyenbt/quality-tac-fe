import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {logger} from '@/lib/monitoring';

export function useNavigationTiming() {
    const location = useLocation();
    const prevPath = useRef(location.pathname);
    const navStart = useRef(performance.now());

    useEffect(() => {
        const now = performance.now();
        const from = prevPath.current;
        const to = location.pathname;

        if (from !== to) {
            const duration = Math.round(now - navStart.current);
            logger.info('perf', 'Route navigation', {
                from,
                to,
                duration_ms: duration,
            });
        }

        prevPath.current = to;
        navStart.current = now;
    }, [location.pathname]);
}
