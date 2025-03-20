import React, { useState } from "react";
import EmployeeList from "./components/EmployeeList";

const App = () => {
    const [key, setKey] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);

    // Función para manejar la entrada de la clave
    const handleKeyChange = (e) => {
        setKey(e.target.value);
    };

    // Verificar la clave y otorgar acceso
    const checkAccess = () => {
        if (key === '123456') {
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

            {/* Mostrar EmployeeList solo si la clave es correcta */}
            {accessGranted ? (
                <EmployeeList />
            ) : (
                <p>Introduce la clave correcta para acceder a la lista de empleados.</p>
            )}
        </div>
    );
};

export default App;
