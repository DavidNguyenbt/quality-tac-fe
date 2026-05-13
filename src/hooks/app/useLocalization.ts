import {useContext} from "react";
import {Localization, LocalizationContext} from "@/utils/context/LocalizationProvider.tsx";


interface UseLocalizationReturnType {
    language: string;
    setLanguage: (language: string) => void;
    t: Localization;
    parseParam: (template: string, params: { [key: string]: string }) => string;
}

const useLocalization = (): UseLocalizationReturnType => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};


export default useLocalization;
