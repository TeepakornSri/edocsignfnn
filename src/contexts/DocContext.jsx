import { createContext, useState } from "react";

export const DocContext = createContext();

export default function DocContextProvider({ children }) {
    const [files, setFiles] = useState({});

    const saveFile = (name, file) => {
        setFiles(prevFiles => ({ ...prevFiles, [name]: file }));
    };

    const getFile = name => files[name];

    return (
        <DocContext.Provider value={{ saveFile, getFile }}>
            {children}
        </DocContext.Provider>
    );
}
