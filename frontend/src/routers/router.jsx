import { createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router-dom"
import App from "../App"
import UserLayout from "../layouts/UserLayout"
import AdminLayout from "../layouts/AdminLayout"

// User pages
import Home from "../pages/user/home/Home"
import Book from "../pages/user/books/Book"
import History from "../pages/user/history/History"
import Bookmark from "../pages/user/bookmark/Bookmark"
import Checkout from "../pages/checkout/Checkout"
import Profile from "../pages/profile/Profile"

// Admin pages
import Dashboard from "../pages/admin/dashboard/Dashboard"
import DataBuku from "../pages/admin/DataBuku"
import DataUser from "../pages/admin/DataUser"
import DataPeminjaman from "../pages/admin/DataPeminjaman"

// Error pages
import Page403 from "../pages/error/Page403"
import Page404 from "../pages/error/Page404"
import { ProtectedRoute } from "../contexts/AuthContext"

const ErrorBoundary = () => {
    const error = useRouteError()

    // Handle 403 (forbiden)
    if (isRouteErrorResponse(error) && error.status === 403) {
        return <Page403 />
    }

    // Else 404 (not found)
    return <Page404 />
}


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                element: <UserLayout />,
                children: [
                    {
                        path: '/',
                        element: <Home />
                    },
                    {
                        path: '/buku',
                        element: <Book />
                    },
                    {
                        path: '/riwayat',
                        element: <History />
                    },
                    {
                        path: '/bookmark',
                        element: <Bookmark />
                    },
                    {
                        path: '/checkout/:orderId',
                        element: (
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path:'/profile',
                        element: (
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                        <AdminLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "",
                        element: <Dashboard />
                    },
                    {
                        path: "users",
                        element: <DataUser />
                    },
                    {
                        path: "buku",
                        element: <DataBuku />
                    },
                    {
                        path: "peminjaman",
                        element: <DataPeminjaman />
                    },
                    {
                        path: "profile",
                        element: <Profile />
                    }
                ]
            }
        ]
    }
])

export default router