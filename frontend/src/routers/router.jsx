import { createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router-dom"
import App from "../App"
import UserLayout from "../layouts/UserLayout"
import AdminLayout from "../layouts/AdminLayout"

// User pages
import Home from "../pages/user/home/Home"
import Book from "../pages/user/books/Book"
import History from "../pages/user/history/History"
import Bookmark from "../pages/user/bookmark/Bookmark"

// Admin pages
import Dashboard from "../pages/admin/Dashboard"

// Error pages
import Page403 from "../pages/error/Page403"
import Page404 from "../pages/error/Page404"
import DataBuku from "../pages/admin/DataBuku"

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
                        path: '/Bookmark',
                        element: <Bookmark />
                    }
                ]
            },
            {
                path: "admin",
                element: <AdminLayout />,
                children: [
                    {
                        path: "",
                        element: <Dashboard />
                    },
                    {
                        path: "buku",
                        element: <DataBuku />
                    }
                ]
            }
        ]
    }
])

export default router