import { createContext, useEffect, useState } from "react";
import axios from '../config/axios';
import Swal from 'sweetalert2';

export const DocContext = createContext();

export default function DocContextProvider({ children }) {

    const [allDoc, setAllDoc] = useState([])
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setLoading(true); 
        axios.get('/content/showalldoc')
            .then(res => {
                setAllDoc(res.data.Docids);
            })
            .catch(err => {
                console.error(err);  
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch documents!',
                    confirmButtonText: 'OK'
                });
            })
            .finally(() => {
                setLoading(false);  
            });
    }, []); 


    return (
        <DocContext.Provider value={{allDoc,loading}}>
            {children}
        </DocContext.Provider>
    );
}
