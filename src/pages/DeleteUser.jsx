import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import api from '../services/api'

function DeleteUser() {
  const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: success
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    setFadeIn(true)
    const timer = setTimeout(() => setFadeIn(false), 500)
    return () => clearTimeout(timer)
  }, [step])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/delete-user-request', { email })
      if (response.data.success !== false) {
        setStep(2)
        setSuccess('Verification code has been sent to your email. Please check your inbox.')
      } else {
        setError(response.data.message || 'Failed to send verification code')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/delete-user-verify', { email, otp })
      if (response.data.success !== false) {
        setStep(3)
        setSuccess('Your account has been permanently deleted.')
      } else {
        setError(response.data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setOtp(value)
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header Section */}
        <div className={`text-center mb-12 transition-all duration-700 ${fadeIn ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent animate-gradient">
            Delete Account
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-6">
            Permanently remove your Fikrless account
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="h-1.5 w-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <div className="h-1.5 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Warning Box - Enhanced */}
        <div className={`mb-8 transition-all duration-700 ${fadeIn ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-900 mb-3">Warning: This Action is Permanent</h3>
                  <p className="text-red-800 text-lg mb-4 leading-relaxed">
                    Deleting your account will permanently remove all your data. This cannot be undone.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {[
                      'Your profile and personal information',
                      'All journal entries and mood logs',
                      'Your achievements and progress',
                      'Your goals and activity data',
                      'All forum posts and comments',
                      'All other associated data'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-red-700">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-14 border border-white/20 transition-all duration-700 ${fadeIn ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-8">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your email address"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  We'll send a verification code to this email address to confirm account deletion.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-shake">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="flex-1 font-medium">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/"
                  className="flex-1 px-8 py-4 text-center border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPSubmit} className="space-y-8">
              <div>
                <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={handleOTPChange}
                    required
                    maxLength={4}
                    className="w-full pl-12 pr-4 py-5 text-3xl tracking-[0.5em] text-center border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 hover:bg-white font-mono font-bold"
                    placeholder="0000"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Enter the 4-digit code sent to <strong className="text-gray-800">{email}</strong>
                </p>
              </div>

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="flex-1 font-medium">{success}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 animate-shake">
                  <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="flex-1 font-medium">{error}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200/30 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-yellow-900 text-base font-bold mb-2">Final Confirmation Required</p>
                      <p className="text-yellow-800 text-sm leading-relaxed">
                        By verifying this code, you confirm that you want to permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp('')
                    setError('')
                    setSuccess('')
                  }}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Deleting Account...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete My Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 py-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Account Deleted Successfully</h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Your account and all associated data have been permanently deleted from our system.
                </p>
              </div>

              {success && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl max-w-md mx-auto">
                  <p className="font-medium">{success}</p>
                </div>
              )}

              <div className="pt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        {step !== 3 && (
          <div className="mt-10 text-center">
            <p className="text-gray-600 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:fikrless01@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors">
                fikrless01@gmail.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeleteUser
