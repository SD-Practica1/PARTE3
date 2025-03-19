import React from "react";
import FileUpload from "./components/FileUpload";
import EmployeeList from "./components/EmployeeList";

const App = () => {
    return (
        <div>
            <h1>Control de Asistencia</h1>
            <FileUpload />
            <EmployeeList />
        </div>
    );
};

export default App;
