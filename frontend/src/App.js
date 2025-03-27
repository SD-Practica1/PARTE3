import React, { useState } from "react";
import CryptoJS from "crypto-js";
import EmployeeList from "./components/EmployeeList";
import { useLanguage } from "./utils/translations";

const SECRET_KEY = "mi_clave_secreta";

const App = () => {
    const [language, setLanguage] = useState('en');
    const t = useLanguage(language);
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
            alert(t.login.incorrectKey);
            setAccessGranted(false);
        }
    };

    return (
        <div>
            {/* Language Selector */}
            <div>
                <button onClick={() => setLanguage('en')}>English</button>
                <button onClick={() => setLanguage('es')}>Español</button>
                <button onClick={() => setLanguage('ko')}>한국어</button>
            </div>

            <h1>{t.login.title}</h1>

            {!accessGranted && (
                <div>
                    <label>{t.login.accessKey}:</label>
                    <input
                        type="password"
                        placeholder={t.login.accessKey}
                        value={key}
                        onChange={handleKeyChange}
                    />
                    <button onClick={checkAccess}>{t.login.accessButton}</button>
                </div>
            )}

            {accessGranted && <EmployeeList language={language} />}
        </div>
    );
};

export default App;