import { createBrowserRouter } from "react-router-dom"

import App from "../App"
import Home from "../pages/home/Home"
import Book from "../pages/books/Book"

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
                element: <div>Riwayat</div>
            }
        ]
    }
])

export default router