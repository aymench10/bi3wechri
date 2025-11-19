import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { sendPasswordResetEmail, isValidEmail } from '../lib/emailService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Validate email
      if (!email.trim()) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      if (!isValidEmail(email)) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      // Send reset email
      const { error: resetError, message } = await sendPasswordResetEmail(email)

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.')
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
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
                  <Mail className="text-primary-600" size={32} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 font-medium">Enter your email to receive a password reset link</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base font-bold disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold transition-colors">
                  <ArrowLeft size={18} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl mb-4 border border-green-200">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 font-medium mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-700 font-medium">
                    <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox. The link expires in 1 hour.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="btn-secondary w-full py-3 text-base font-bold mb-3"
                >
                  Send Another Link
                </button>

                <Link to="/login" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold transition-colors">
                  <ArrowLeft size={18} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
