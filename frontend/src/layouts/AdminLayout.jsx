import React from 'react'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/admin/Navbar'
import Footer from '../components/admin/Footer'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className='min-h-screen bg-[#0f0a19] text-white'>
            <Sidebar />
            <main className='ml-64'>
                <Navbar />
                <div className='p-8'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout