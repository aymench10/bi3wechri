import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { updateUserPassword } from '../lib/emailService'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()

  // Validate reset token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if user has valid session (from reset link)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          setValidationError('Invalid or expired reset link. Please request a new one.')
          setValidating(false)
          return
        }

        setValidating(false)
      } catch (err) {
        console.error('Validation error:', err)
        setValidationError('An error occurred. Please try again.')
        setValidating(false)
      }
    }

    validateToken()
  }, [])

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters'
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate passwords
      if (!password.trim() || !confirmPassword.trim()) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const passwordError = validatePassword(password)
      if (passwordError) {
        setError(passwordError)
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Update password
      const { error: updateError } = await updateUserPassword(password)

      if (updateError) {
        setError(updateError.message || 'Failed to reset password')
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-bold text-lg">Validating reset link...</p>
            <p className="text-gray-500 font-medium text-sm mt-1">Please wait</p>
          </div>
        </div>
      </div>
    )
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="card p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 border border-red-200">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 font-medium mb-6">{validationError}</p>
            <a href="/forgot-password" className="btn-primary inline-block">
              Request New Link
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="card p-8 sm:p-10">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl mb-4 border border-primary-200">
                  <Lock className="text-primary-600" size={32} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Set New Password</h2>
                <p className="text-gray-600 font-medium">Create a strong password for your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    At least 6 characters, 1 uppercase, 1 lowercase, 1 number
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base font-bold disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl mb-4 border border-green-200">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Password Reset</h2>
                <p className="text-gray-600 font-medium mb-6">
                  Your password has been successfully reset. You'll be redirected to login shortly.
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
