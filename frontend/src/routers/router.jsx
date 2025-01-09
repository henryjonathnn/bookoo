import { createBrowserRouter } from "react-router-dom"

import App from "../App"
import Home from "../pages/home/Home"
import Book from "../pages/books/Book"
import History from "../pages/history/History"
import Bookmark from "../pages/bookmark/Bookmark"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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