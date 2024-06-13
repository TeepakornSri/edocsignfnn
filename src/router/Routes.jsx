import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../pages/Loginpage';
import UploadPage from '../pages/Upload';
import RedirectIfAuthenticated from '../features/RedireactIfAuthenticated';
import AuthenticatedUser from '../features/AuthenticateUser';
import HomePage from '../pages/็Homepage';
import Userselect from '../pages/Userselect';

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: '',
                element: (
                    <RedirectIfAuthenticated>
                        <LoginPage />
                    </RedirectIfAuthenticated>
                ),
            },
        ],
    }
    ,
    {
        path: '/Homepage',
        element: (
        <AuthenticatedUser>
        <Layout />
        </AuthenticatedUser>
        ),
        children: [
            {
                path: '',
                element: <HomePage/>,
            },
            
        ],
    },

    {
        path: '/upload',
        element: <Layout />,
        children: [
            {
                path: '',
                element: (
                    <AuthenticatedUser>
                        <UploadPage />
                    </AuthenticatedUser>
                ),
            },
        ],
    },
    {
        path: '/userselect',
        element: <Layout />,
        children: [
            {
                path: '',
                element: (
                    <AuthenticatedUser>
                        <Userselect />
                    </AuthenticatedUser>
                ),
            },
        ],
    },
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}
