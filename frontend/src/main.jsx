import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link, Outlet, Navigate } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import App from './App.jsx'
import About from './About.jsx'
import Pricing from './pages/Pricing.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import './index.css'
import './app.css'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function RootLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/signup" replace /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/forgot', element: <ForgotPassword /> },
      { path: '/reset', element: <ResetPassword /> },
      { path: '/app', element: (
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      ) },
      { path: '/about', element: <About /> },
      { path: '/pricing', element: <Pricing /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
