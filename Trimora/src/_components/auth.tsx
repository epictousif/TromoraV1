import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, Phone, MapPin, Gift, Calendar, Eye, EyeOff } from 'lucide-react'

export function AuthCard() {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phoneNumber: '',
    city: '',
    referralCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Auto-fill functionality on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('trimora_saved_email')
    const savedPassword = localStorage.getItem('trimora_saved_password')
    const savedRememberMe = localStorage.getItem('trimora_remember_me') === 'true'

    if (savedRememberMe && savedEmail && savedPassword) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        password: savedPassword
      }))
      setRememberMe(true)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'referralCode' ? value.toUpperCase() : value
    })
  }

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setRememberMe(checked)
    
    // If unchecking during login, clear saved credentials
    if (!checked && isLogin) {
      localStorage.removeItem('trimora_saved_email')
      localStorage.removeItem('trimora_saved_password')
      localStorage.removeItem('trimora_remember_me')
    }
  }

  const saveCredentials = () => {
    if (rememberMe) {
      localStorage.setItem('trimora_saved_email', formData.email)
      localStorage.setItem('trimora_saved_password', formData.password)
      localStorage.setItem('trimora_remember_me', 'true')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/v1/user/login' : '/api/v1/user/register'
      
      // Prepare data - only send non-empty optional fields for registration
      let requestData: any = { ...formData }
      if (!isLogin) {
        // For registration, only include optional fields if they have values
        if (!formData.phoneNumber) delete requestData.phoneNumber
        if (!formData.city) delete requestData.city
        if (!formData.referralCode) delete requestData.referralCode
        if (!formData.dateOfBirth) delete requestData.dateOfBirth
        
        // Map dateOfBirth to dob for backend compatibility
        if (formData.dateOfBirth) {
          requestData.dob = formData.dateOfBirth
          delete requestData.dateOfBirth
        }
      }
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Save credentials if remember me is checked
      saveCredentials()

      if (isLogin) {
        login({ token: data.accessToken, user: data.user })
        navigate('/')
      } else {
        // After registration, automatically log in
        const loginResponse = await fetch('http://localhost:5000/api/v1/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        const loginData = await loginResponse.json()
        if (loginResponse.ok) {
          login({ token: loginData.accessToken, user: loginData.user })
          navigate('/')
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-all duration-500 ease-in-out">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg transform transition-all duration-700 ease-in-out hover:shadow-2xl hover:scale-[1.02] animate-in fade-in slide-in-from-left-5">
          <div className="animate-in fade-in slide-in-from-top-3 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">
              {isLogin ? 'Sign In' : 'Registration'}
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-600" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group animate-in fade-in slide-in-from-left-3 duration-500">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
                <Input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
                />
              </div>
            )}
            
            <div className="relative group animate-in fade-in slide-in-from-left-3 duration-500 delay-100">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
              <Input
                name="email"
                type="email"
                required
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
              />
            </div>
            
            <div className="relative group animate-in fade-in slide-in-from-left-3 duration-500 delay-200">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password *"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative group animate-in fade-in slide-in-from-left-3 duration-500 delay-300">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
                <Input
                  name="dateOfBirth"
                  type="date"
                  placeholder="dd-mm-yyyy"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
                />
              </div>
            )}

            {!isLogin && (
              <>
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-400">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 transition-all duration-300">Optional Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group animate-in fade-in slide-in-from-left-2 duration-500 delay-500">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
                      <Input
                        name="phoneNumber"
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
                      />
                    </div>
                    
                    <div className="relative group animate-in fade-in slide-in-from-right-2 duration-500 delay-500">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
                      <Input
                        name="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="relative mt-4 group animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600">
                    <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-purple-500" />
                    <Input
                      name="referralCode"
                      type="text"
                      placeholder="Referral Code"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className="pl-10 py-3 bg-gray-50 border-gray-200 transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900">
                    I want to receive updates, offers, and notifications from Trimora.
                  </label>
                </div>
              </>
            )}

            <div className="flex items-center justify-between mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 transition-colors duration-200 hover:text-gray-900">
                  {isLogin ? 'Remember me' : 'Remember my details'}
                </label>
              </div>

              {isLogin && (
                <div className="text-sm">
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] animate-in fade-in slide-in-from-bottom-3 delay-600"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </span>
              ) : (isLogin ? 'Sign In' : 'Register')}
            </Button>

            <div className="text-center mt-4 animate-in fade-in duration-500 delay-700">
              <p className="text-sm text-gray-600 transition-colors duration-200">
                or sign in with
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Purple Gradient with Toggle */}
      <div className="w-1/2 relative bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex flex-col items-center justify-center text-white p-8 transition-all duration-700 ease-in-out animate-in fade-in slide-in-from-right-5"
           style={{
             borderTopLeftRadius: '80px',
             borderBottomLeftRadius: '80px'
           }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 bg-pink-400/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-8 w-12 h-12 bg-indigo-400/15 rounded-full animate-ping delay-700"></div>
        </div>
        
        <div className={`text-center max-w-md relative z-10 transition-all duration-700 ease-in-out transform ${
          isLogin ? 'animate-[slideRight_0.7s_ease-in-out]' : 'animate-[slideLeft_0.7s_ease-in-out]'
        }`}>
          <h1 className="text-4xl font-bold mb-4 transition-all duration-500 transform hover:scale-105 hover:rotate-1">
            {isLogin ? 'New Here?' : 'Welcome Back!'}
          </h1>
          <p className="text-purple-100 text-lg mb-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 delay-500">
            {isLogin ? 'Sign up and discover amazing salon services near you!' : 'Sign in to continue your beauty journey'}
          </p>
          
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-2xl active:scale-95 animate-in fade-in slide-in-from-bottom-4 delay-700 group"
          >
            <span className="group-hover:animate-pulse">
              {isLogin ? 'Create Account' : 'Sign In Instead'}
            </span>
          </button>
        </div>

        {/* Custom CSS for slide animations */}
        <style>{`
          @keyframes slideRight {
            0% { transform: translateX(-20px); opacity: 0.8; }
            50% { transform: translateX(10px); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideLeft {
            0% { transform: translateX(20px); opacity: 0.8; }
            50% { transform: translateX(-10px); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )}

// Default export for lazy loading
export default AuthCard
