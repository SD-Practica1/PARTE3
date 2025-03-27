import React, { useState } from "react";
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import CryptoJS from "crypto-js";
import i18n from './i18n';
import EmployeeList from "./components/EmployeeList";

const SECRET_KEY = "mi_clave_secreta";

const MainApp = () => {
    const { t, i18n: languageInstance } = useTranslation();
    const [key, setKey] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);

    const handleKeyChange = (e) => {
        setKey(e.target.value);
    };

    const checkAccess = () => {
        if (key === "123456") {
            const encrypted = CryptoJS.AES.encrypt(key, SECRET_KEY).toString();
            setAccessGranted(true);
        } else {
            alert(t('login.incorrectKey'));
            setAccessGranted(false);
        }
    };

    const changeLanguage = (lng) => {
        languageInstance.changeLanguage(lng);
    };

    return (
        <div>
            {/* Language Selector */}
            <div>
                <button onClick={() => changeLanguage('en')}>English</button>
                <button onClick={() => changeLanguage('es')}>Español</button>
                <button onClick={() => changeLanguage('ko')}>한국어</button>
            </div>

            <h1>{t('login.title')}</h1>

            {!accessGranted && (
                <div>
                    <label>{t('login.accessKey')}:</label>
                    <input
                        type="password"
                        placeholder={t('login.accessKey')}
                        value={key}
                        onChange={handleKeyChange}
                    />
                    <button onClick={checkAccess}>{t('login.accessButton')}</button>
                </div>
            )}

            {accessGranted && <EmployeeList />}
        </div>
    );
};

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <MainApp />
        </I18nextProvider>
    );
};

export default App;