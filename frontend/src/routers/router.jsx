import { createBrowserRouter } from "react-router-dom"

import App from "../App"
import Home from "../pages/home/Home"
import Book from "../pages/books/Book"
import History from "../pages/history/History"
import Bookmark from "../pages/bookmark/Bookmark"
import Page403 from "../pages/error/Page403"
import Page404 from "../pages/error/Page404"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Page404 />,
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
            }
        ]
    }
])

export default router