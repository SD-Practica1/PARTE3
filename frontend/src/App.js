import React, { useState } from "react";
import CryptoJS from "crypto-js";
import EmployeeList from "./components/EmployeeList";

const SECRET_KEY = "mi_clave_secreta"; // Cambia esto por una clave segura

const App = () => {
    const [key, setKey] = useState('');
    const [encryptedKey, setEncryptedKey] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);

    // Función para manejar la entrada de la clave
    const handleKeyChange = (e) => {
        setKey(e.target.value);
    };

    // Verificar la clave y otorgar acceso
    const checkAccess = () => {
        if (key === "123456") {
            // Cifrar la clave y guardarla
            const encrypted = CryptoJS.AES.encrypt(key, SECRET_KEY).toString();
            setEncryptedKey(encrypted);

            setAccessGranted(true);  // Acceso concedido
        } else {
            alert('Clave incorrecta. Acceso denegado.');
            setAccessGranted(false);  // Acceso denegado
        }
    };

    return (
        <div>
            <h1>Control de Asistencia</h1>

            {/* Mostrar el campo de clave solo si no se ha concedido acceso */}
            {!accessGranted && (
                <div>
                    <label>Introduce la clave de acceso:</label>
                    <input
                        type="password"
                        placeholder="Clave de acceso"
                        value={key}
                        onChange={handleKeyChange}
                    />
                    <button onClick={checkAccess}>Acceder</button>
                </div>
            )}

            {/* Mostrar información cifrada solo si la clave es correcta */}
            {accessGranted ? (
                <div>
                    <EmployeeList />
                    <p><strong>Clave encriptada:</strong></p>
                    <textarea 
                        value={encryptedKey} 
                        readOnly 
                        rows="4" 
                        cols="50"
                    />
                </div>
            ) : (
                <p>Introduce la clave correcta para acceder a la lista de empleados.</p>
            )}
        </div>
    );
};

export default App;
