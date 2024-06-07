import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout'
import LoginPage from '../pages/Loginpage'
import UploadPage from '../pages/Upload'
import HomePage from '../pages/Homepage'
import RedirectIfAuthenticated from '../features/RedireactIfAuthenticated'
import AuthenticatedUser from '../features/AuthenticateUser'

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: '',
                element: <RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>
            }
        ]
    },
    {
        path: 'Homepage',
        element: <Layout />,
        children: [

            {
                path: '',
                element:
                    <AuthenticatedUser>
                        <HomePage />
                    </AuthenticatedUser>

            }
        ]
    },
    {
        path: 'upload',
        element: <Layout />,
        children: [

            {
                path: '',
                element:
                    <AuthenticatedUser>
                        <UploadPage />
                    </AuthenticatedUser>

            }
        ]
    }
])

export default function Routes() {
    return <RouterProvider router={router} />
}
