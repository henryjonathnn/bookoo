import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <main className='min-h-screen bg-[#0D0D1A] text-white bg-pattern'>
        <Outlet />
      </main>
    </>
  )
}

export default App
