import React, { useState, useEffect } from 'react'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/admin/Navbar'
import Footer from '../components/admin/Footer'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Listen for sidebar close events from NavItem clicks
        const handleCloseSidebar = () => setIsSidebarOpen(false);
        window.addEventListener('closeSidebar', handleCloseSidebar);
        
        // Handle resize events
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('closeSidebar', handleCloseSidebar);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className='min-h-screen bg-[#0f0a19] text-white'>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className='md:ml-64'>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className='p-4 md:p-8 pt-20'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout