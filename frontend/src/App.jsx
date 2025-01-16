import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function App() {

  return (
    <>
      <AuthProvider>
      <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1A1A2E',
                        color: '#fff',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        <div className='min-h-screen bg-[#0D0D1A] text-white bg-pattern'>
          <Sidebar />
          <main className='ml-20'>
            <Navbar />
            <Outlet />
            <Footer />
          </main>
        </div>
      </AuthProvider>
    </>
  )
}

