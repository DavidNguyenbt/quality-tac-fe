import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface LocalizationContextProps {
    language: string;
    setLanguage: (language: string) => void;
    t: Localization;
    parseParam: (template: string, params: { [key: string]: string }) => string;

}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>(() => {
        const savedLanguage = localStorage.getItem('language_qc');
        return savedLanguage ?? 'en';
    });
    const [translations, setTranslations] = useState<Localization>({} as Localization);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}${language}.json`);
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        };

        loadTranslations();
    }, [language]);

    useEffect(() => {
        localStorage.setItem('language_qc', language);
    }, [language]);

    const parseParam = (template: string, params: { [key: string]: string }) => {
        return template.replace(/{(\w+)}/g, (_, key) => params[key] || '');
    };

    return (
        <LocalizationContext.Provider value={{ language, setLanguage, t: translations, parseParam }}>
            {children}
        </LocalizationContext.Provider>
    );
};



export { LocalizationProvider, LocalizationContext };

export interface Localization {
    titleAccount: string;
    titleMyNote: string;
    titleRolePermission: string;
    titleInfo: string;
    btnBack: string;
    allTotal: string;
    btnTextSave: string;
    btnTextCreate: string;
    btnTextCancel: string;
    btnDelete: string;
    account: {
        login: string;
        logout: string;
        search: string;
        fullname: string;
        email: string;
        phone: string;
        employeeCode: string;
        username: string;
        createAccount: string;
        editAccount: string;
        password: string;
        status: string;
        validateUserRequired: string;
        validatePasswordRequired: string;
        validateCheckLenght: string;
        validateCheckUppercase: string;
        validateCheckLowercase: string;
        validateCheckNumber: string;
        validateCheckMinLenght: string;
        validateCheckMaxLenght: string;
        validateCharacterst: string;
        validatePasswordMismatch: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
        alertDeleteAccount: string
    };
    rolePermission: {
        permission: string;
        customer: string;
        search: string;
        groupName: string;
        userAccounts: string;
        verifyAccounts: string;
        approvedAccounts: string;
    };
    myNote: {
        title: string;
        titleEdit: string;
        titleCreateNote: string;
        search: string;
        alertNoNote: string;
        note: string;
    },
    calendar: {
        january: string;
        february: string;
        march: string;
        april: string;
        may: string;
        june: string;
        july: string;
        august: string;
        september: string;
        october: string;
        november: string;
        december: string;
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
        sat: string;
        sun: string;
    }
    standard: {
        titleClose: string;
        contentClose: string;
        close: string;
        all: string;
        create: string;
        save: string;
        back: string;
        yes: string;
        no: string;
        cancel: string;
        active: string;
        inactive: string;
        status: string;
        msgPopupDelete: string;
        next: string;
        confirm: string;
        createSuccess: string;
        updateSuccess: string;
        deleteSuccess: string;
        checkFormatDate: string;
        checkFileExist: string;
        createAndArrange: string;
        arrange: string;
        reArrange: string;
        print: string;
        add: string;
        shipped: string;
        allTotal: string;
        scanIn: string;
        scanOut: string;
        export: string;
        import: string;
        filter: string;
        statusBarcode: string;
        login: string;
        receive: string;
        totalSelected: string;
        validateCheckMaxSize: string;
        validateCheckExtensions: string;
        printFromFile: string;
        printQrCode: string;
        uploadFileHere: string;
        browseFile: string;
        titleNoted: string;
        noted: string;
        downloadTemplate: string;
        edit: string;
        generalInfo: string;
        createdBy: string;
        createdDate: string;
        updatedBy: string;
        updatedDate: string;
        optionIssue: string;
        sumData: string;
        download: string;
        restore: string;
        detail: string;
        SESSION_EXPIRES_SOON: string;
        SESSION_EXPIRED: string
    }
}
