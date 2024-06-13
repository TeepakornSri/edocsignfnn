import { createContext, useEffect, useState } from "react";
import axios from '../config/axios';
import { addAccessToken, getAccessToken, removeAccessToken } from "../utils/local-storage";
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (getAccessToken()) {
            axios.get('/auth/me')
                .then(res => {
                    setAuthUser(res.data.user);
                })
                .finally(() => {
                    setInitialLoading(false);
                });
        } else {
            setInitialLoading(false);
        }
    }, []);

    const login = async objUser => {
        try {
            const res = await axios.post('/auth/login', objUser);
            if (res.status === 200) {
                addAccessToken(res.data.accessToken);
                setAuthUser(res.data.user);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login success",
                    showConfirmButton: false,
                    timer: 1500
                });
                setInitialLoading(false);
            }
        } catch (error) {
            console.error("Login failed", error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Login failed",
                text: "Email หรือ รหัสไม่ถูกต้อง",
                showConfirmButton: true,
            });
        }
    };

    const register = async registerInputObject => {
        const res = await axios.post('/auth/register', registerInputObject);
        if (res.status === 201) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Register success",
                showConfirmButton: false,
                timer: 1500
            });
            addAccessToken(res.data.accessToken);
            setAuthUser(res.data.user);
        }
    };

    const logout = () => {
        setInitialLoading(true);
        removeAccessToken();
        setAuthUser(null);
        setInitialLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, authUser, initialLoading, setInitialLoading, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
