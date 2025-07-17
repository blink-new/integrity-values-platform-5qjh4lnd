import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import DefineValues from './pages/DefineValues'
import WeeklyCheckin from './pages/WeeklyCheckin'
import AuthPage from './pages/AuthPage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/dashboard/define-values" 
          element={user ? <DefineValues /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/dashboard/weekly-checkin" 
          element={user ? <WeeklyCheckin /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  )
}

export default App