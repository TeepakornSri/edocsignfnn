import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import LoginPage from '../pages/Loginpage';
import UploadPage from '../pages/Upload';
import RedirectIfAuthenticated from '../features/RedireactIfAuthenticated';
import AuthenticatedUser from '../features/AuthenticateUser';
import HomePage from '../pages/็Homepage';
import Userselect from '../pages/Userselect';
import ApproveReject from '../components/Approve';
import UpdatePage from '../pages/Update';
import UserselectUpdate from '../pages/UpdateUserselect';

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
    },
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
                element: <HomePage />,
            },
        ],
    },
    {
        path: '/upload',
        element: (
            <AuthenticatedUser>
                <Layout />
            </AuthenticatedUser>
        ),
        children: [
            {
                path: '',
                element: <UploadPage />,
            },
            {
                path: 'update/:docId', 
                element: <UpdatePage />,
            },
            {
                path: 'updateuserselect/:docId', 
                element: <UserselectUpdate />,
            },
        ],
    },
    {
        path: '/userselect',
        element: (
            <AuthenticatedUser>
                <Layout />
            </AuthenticatedUser>
        ),
        children: [
            {
                path: '',
                element: <Userselect />,
            },
        ],
    },
    {
        path: '/approve/:docId/:recipientId/:action',
        element: <ApproveReject />,
    },
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}
