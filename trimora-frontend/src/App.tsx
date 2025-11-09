import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SalonUserLayout from '@/saloonUser/salon-user-layout'
import { ProtectedRoute } from '@/saloonUser/components/ProtectedRoute'
import { AuthPage } from '@/saloonUser/pages/AuthPage'
import { useAuth } from '@/saloonUser/hooks/useAuth'
import { Loader2 } from 'lucide-react'

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Routes>
          {/* Login page at root - redirect to dashboard if authenticated */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/saloonUser" replace /> : <AuthPage />
            } 
          />
          
          {/* Protected salon user routes */}
          <Route 
            path="/saloonUser/*" 
            element={
              <ProtectedRoute>
                <SalonUserLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect based on auth status */}
          <Route 
            path="*" 
            element={
              <Navigate to={isAuthenticated ? "/saloonUser" : "/"} replace />
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
