import { createBrowserRouter } from "react-router-dom"
import App from "../App"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <h1>Beranda</h1>
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