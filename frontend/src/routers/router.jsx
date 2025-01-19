import { createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router-dom"

import App from "../App"
import Home from "../pages/home/Home"
import Book from "../pages/books/Book"
import History from "../pages/history/History"
import Bookmark from "../pages/bookmark/Bookmark"
import Page403 from "../pages/error/Page403"
import Page404 from "../pages/error/Page404"
import Dashboard from "../pages/admin/Dashboard"

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
                path: "/",
                element: <Home />
            },
            {
                path: "/buku",
                element: <Book />
            },
            {
                path: "/riwayat",
                element: <History />
            },
            {
                path: "/bookmark",
                element: <Bookmark />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            }
        ]
    }
])

export default router