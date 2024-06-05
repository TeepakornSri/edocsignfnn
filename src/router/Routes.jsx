import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/Layout'
import LoginPage from '../pages/Loginpage'
import UploadPage from '../pages/Upload'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '', element: <LoginPage /> },
            { path: 'upload', element: <UploadPage /> }
        ]
    }
])

export default function Route() {
    return <RouterProvider router={router} />
}