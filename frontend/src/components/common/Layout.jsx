import React from 'react'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex h-screen bg-gray-100'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
            <TopNavbar />
            <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
              <Outlet />
            </main>
        </div>
    </div>
  )
}

export default Layout