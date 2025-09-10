import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom'
import App from './App.jsx'
import About from './About.jsx'
import './index.css'
import './app.css'

function Nav() {
  return (
    <div className="w-full bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-800">AI Resume Optimizer</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-600 hover:text-slate-900">Home</Link>
          <Link to="/about" className="text-slate-600 hover:text-slate-900">About</Link>
        </div>
      </div>
    </div>
  )
}

function RootLayout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/about', element: <About /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
