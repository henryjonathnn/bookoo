import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"

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
                element: <div>Buku</div>
            },
            {
                path: "/riwayat",
                element: <div>Riwayat</div>
            }
        ]
    }
])

export default router