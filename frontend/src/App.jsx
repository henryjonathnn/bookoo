import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import './App.css'

export default function App() {

  return (
    <>
      <div className='min-h-screen bg-[#0D0D1A] text-white bg-pattern'>
        <Sidebar />
        <main className='ml-20'>
          <Navbar />
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  )
}

