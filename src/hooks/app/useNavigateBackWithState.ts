import {useNavigate} from 'react-router-dom';
import {navigationState} from "@/utils/states/state.ts";

const useNavigateBackWithState = () => {
    const navigate = useNavigate();

    const navigateBack = (state: any) => {
        navigationState.value = state;
        navigate(-1);
    };

    const getState = () => {
        return navigationState.value;
    };

    const clearState = () => {
        navigationState.value = null
    }

    return {navigateBack, getState, clearState};
};

export default useNavigateBackWithState;
