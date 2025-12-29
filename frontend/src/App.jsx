import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import MyEnquiries from './pages/MyEnquiries'
import ProtectedRoute from './components/ProtectedRoute'

// User Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Admin imports
import AdminLogin from './admin/pages/auth/Login'
import AdminForgotPassword from './admin/pages/auth/ForgotPassword'
import AdminLayout from './admin/components/AdminLayout'
import PrivateRoute from './admin/components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Frontend Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="contact" element={<Contact />} />

            {/* Redirect /enquiries to /contact */}
            <Route path="enquiries" element={<Navigate to="/contact" replace />} />

            {/* Protected User Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-enquiries"
              element={
                <ProtectedRoute>
                  <MyEnquiries />
                </ProtectedRoute>
              }
            />

            {/* 404 - Must be last in this group */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* User Auth Routes (Public) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Login Routes (Public) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
