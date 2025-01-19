import React from 'react'
import Sidebar from '../components/user/Sidebar'
import Navbar from '../components/user/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/user/Footer'

const UserLayout = () => {
  return (
    <div className='min-h-screen bg-[#0D0D1A] text-white bg-pattern'>
        <Sidebar />
        <main className='md:ml-20'>
            <Navbar />
            <Outlet />
            <Footer />
        </main>
    </div>
  )
}

export default UserLayout