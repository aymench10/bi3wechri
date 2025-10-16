import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateAd from './pages/CreateAd'
import EditAd from './pages/EditAd'
import AdDetail from './pages/AdDetail'
import Profile from './pages/Profile'
import MyAds from './pages/MyAds'
import Favorites from './pages/Favorites'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="ads/:id" element={<AdDetail />} />
            <Route path="profile/:userId" element={<Profile />} />
            
            {/* Protected Routes */}
            <Route path="create-ad" element={
              <ProtectedRoute>
                <CreateAd />
              </ProtectedRoute>
            } />
            <Route path="edit-ad/:id" element={
              <ProtectedRoute>
                <EditAd />
              </ProtectedRoute>
            } />
            <Route path="my-ads" element={
              <ProtectedRoute>
                <MyAds />
              </ProtectedRoute>
            } />
            <Route path="favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
