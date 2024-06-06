import { useAuth } from "../hooks/use-auth"
import { Navigate } from 'react-router-dom'

export default function RedirectIfAuthenticated({ children }) {
    const { authUser } = useAuth()
    if (authUser) {
        if (authUser.role === 'USER') {
            return <Navigate to='/upload' />
        } else {
            return <Navigate to="/" />
        }
    }
    return children
}
