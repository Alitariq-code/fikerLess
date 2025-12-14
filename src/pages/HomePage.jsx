import { useState } from 'react'
import '../styles/index.css'
import LoadingScreen from '../components/LoadingScreen'
import ScrollProgress from '../components/ScrollProgress'
import CustomCursor from '../components/CustomCursor'
import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import WelcomeSection from '../components/WelcomeSection'
import AboutSection from '../components/AboutSection'
import FoundersSection from '../components/FoundersSection'
import ServicesSection from '../components/ServicesSection'
import InfoSection from '../components/InfoSection'
import MentorCardsSection from '../components/MentorCardsSection'
import FAQSection from '../components/FAQSection'
import ContactSection from '../components/ContactSection'

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
    // TODO: Implement search functionality
    // This will connect to your NestJS backend
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Search */}
      <HeroSection onSearch={handleSearch} />

      {/* Welcome Section */}
      <WelcomeSection />

      {/* About Section */}
      <AboutSection />

      {/* Founders Section */}
      <FoundersSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Info Section */}
      <InfoSection />

      {/* Mentor Cards Section */}
      <MentorCardsSection searchTerm={searchTerm} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

export default HomePage

