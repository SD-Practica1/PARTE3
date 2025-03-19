import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            setMessage("Selecciona un archivo primero.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage("Error al subir el archivo.");
        }
    };

    return (
        <div>
          
        </div>
    );
};

export default FileUpload;
