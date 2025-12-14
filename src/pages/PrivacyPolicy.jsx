import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import CustomCursor from '../components/CustomCursor'

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent animate-gradient">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Last Updated: <span className="font-semibold text-blue-600">11 Dec 2025</span>
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 space-y-8 animate-fade-in">
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              FikrLess ("the app", "we", "us", "our") is operated by an individual developer.
              We provide general wellbeing tools and a way for users to book sessions with independent professionals. 
              This Privacy Policy explains how we collect, use, and protect your information. 
              By using FikrLess, you agree to this Privacy Policy.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              1. Information We Collect
            </h2>
            
            <div className="pl-5 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                <p className="text-gray-700 mb-2">We may collect:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Basic demographic information (e.g., age range, gender)</li>
                  <li>Booking and appointment information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1.2 Wellbeing & Self-Reported Information (Sensitive Data)</h3>
                <p className="text-gray-700 mb-2">You may choose to provide:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Mental health goals</li>
                  <li>Mood logs</li>
                  <li>Journalling entries</li>
                  <li>Lifestyle and wellbeing information</li>
                  <li>General self-reflection data</li>
                  <li>Your preferences for therapist matching</li>
                  <li>Confirmation that you understand FikrLess is not a medical or emergency service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1.3 Automatically Collected Information</h3>
                <p className="text-gray-700 mb-2">This may include:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Device information</li>
                  <li>Step count data (from device sensors/permissions)</li>
                  <li>App usage statistics</li>
                  <li>Non-identifiable technical data</li>
                </ul>
                <p className="text-gray-700 mt-3 italic">
                  We do not collect or store precise location data unless explicitly required for bookings you initiate.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide wellbeing tools (step counter, journalling, mood tracking, meditation content, articles)</li>
              <li>Match you with suitable independent professionals</li>
              <li>Manage your bookings and communication</li>
              <li>Improve app functionality</li>
              <li>Maintain safety and comply with legal obligations</li>
            </ul>
            <p className="text-gray-700 mt-4 font-semibold">
              We do not use your data to provide medical diagnosis or treatment.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              3. Not a Medical Service
            </h2>
            <p className="text-gray-700 font-semibold mb-3">FikrLess is a general wellbeing and self-awareness app.</p>
            <p className="text-gray-700 mb-3">It does not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide medical or psychiatric services</li>
              <li>Diagnose or treat mental health conditions</li>
              <li>Replace professional healthcare</li>
              <li>Replace emergency or crisis services</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Any wellbeing insights or journalling prompts in the app are for personal reflection only, not medical advice.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              4. Therapy and Professional Sessions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Practitioners available through FikrLess are independent professionals, not employees or representatives of FikrLess or the individual developer.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Sessions take place through external apps (Zoom, WhatsApp, Google Meet, etc.).</li>
              <li>FikrLess does not record or store session audio or video.</li>
              <li>Your communication with professionals is governed by their own privacy policies and the policies of the external platform used.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              5. Sharing of Information
            </h2>
            <p className="text-gray-700 mb-3">Your information may be shared only with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Independent professionals you choose to book a session with</li>
              <li>Service providers needed to operate the app (e.g., analytics, hosting)</li>
              <li>Legal authorities, if required by law</li>
            </ul>
            <p className="text-gray-700 mt-4 font-semibold text-blue-600">
              We do not sell your information to third parties.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              6. Data Storage, Security, and Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We take reasonable measures to protect your data, but no online service is completely secure.
            </p>
            <p className="text-gray-700 mb-3">We keep your information only as long as necessary for:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Your use of the app</li>
              <li>Legal or regulatory purposes</li>
              <li>Maintaining your account</li>
            </ul>
            <p className="text-gray-700 mt-4 font-semibold">
              You may request deletion at any time.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              7. Your Rights
            </h2>
            <p className="text-gray-700 mb-3">Depending on your location, you may have rights to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access your information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion</li>
              <li>Withdraw consent</li>
              <li>Request a copy of your data</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, email us at:{' '}
              <a href="mailto:fikrless01@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline">
                fikrless01@gmail.com
              </a>
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              8. Minors
            </h2>
            <p className="text-gray-700 leading-relaxed">
              FikrLess is intended for users 18 years and older.
            </p>
            <p className="text-gray-700 font-semibold">
              We do not knowingly collect data from minors.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              9. External Links and Third-Party Providers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Meditation clips, articles, videos, and appointment sessions may link to third-party platforms.
            </p>
            <p className="text-gray-700 font-semibold">
              We are not responsible for the privacy practices of external sites or services.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this policy from time to time.
            </p>
            <p className="text-gray-700 font-semibold">
              Your continued use of the app constitutes acceptance of any changes.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              11. Contact Us
            </h2>
            <p className="text-gray-700 text-lg">
              For questions or concerns, contact:{' '}
              <a 
                href="mailto:fikrless01@gmail.com" 
                className="text-blue-600 hover:text-blue-800 font-bold underline text-xl"
              >
                fikrless01@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-arrow-left mr-3"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

