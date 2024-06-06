import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export default function AuthenticatedUser({ children }) {
    const { authUser } = useAuth()

    if (!authUser || authUser.role !== 'USER') {
        console.log("Please Login");
        return <Navigate to='/' />
    }
    return children
}
