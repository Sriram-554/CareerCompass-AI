import { useState } from 'react'
import Assessment from './Assessment'
import './App.css'

const features = [
  {
    icon: '🎯',
    title: 'Smart Career Discovery',
    description: 'Discover career paths that align with your interests, strengths and aspirations.',
  },
  {
    icon: '📊',
    title: 'Skill Gap Analysis',
    description: 'Understand your existing skills and identify the areas you need to improve.',
  },
  {
    icon: '🗺️',
    title: 'Personalized Roadmaps',
    description: 'Get a structured learning journey with skills, projects and resources.',
  },
  {
    icon: '🚀',
    title: 'Industry Insights',
    description: 'Explore emerging technologies, career opportunities and in-demand skills.',
  },
]

function App() {
  const [showAssessment, setShowAssessment] = useState(false)

  if (showAssessment) {
    return <Assessment onBack={() => setShowAssessment(false)} />
  }

  return (
    <div className="website">

      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="logo" onClick={(e) => e.preventDefault()}>
          <span className="logo-icon">✦</span>
          CareerCompass<span className="ai">AI</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <button
          type="button"
          className="nav-button"
          onClick={() => setShowAssessment(true)}
        >
          Get Started <span>→</span>
        </button>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="hero" id="home">
          <div className="hero-content">

            <div className="announcement">
              <span>✦</span> Your future, guided by intelligence
            </div>

            <h1>
              Discover Your Path.
              <br />
              <span>Define Your Future.</span>
            </h1>

            <p className="hero-description">
              Confused about your career? Let AI help you discover
              your strengths, explore career opportunities and build
              a personalized roadmap towards your dream career.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowAssessment(true)}
              >
                Discover Your Career <span>→</span>
              </button>
              <a href="#how-it-works" className="secondary-button">
                Explore How It Works
              </a>
            </div>

            <div className="hero-trust">
              <span>✓ Skill-based recommendations</span>
              <span>✓ Personalized roadmaps</span>
            </div>

          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="central-card">
              <div className="central-icon">✦</div>
              <h3>Your Future Starts Here</h3>
              <p>Explore your potential</p>
              <div className="career-tags">
                <span>AI & ML</span>
                <span>Technology</span>
                <span>Innovation</span>
              </div>
            </div>

            <div className="floating-card floating-top">
              <span>🎯</span>
              <div>
                <strong>Discover</strong>
                <small>Your strengths</small>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span>🗺️</span>
              <div>
                <strong>Build</strong>
                <small>Your roadmap</small>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-label">WHAT WE OFFER</span>
            <h2>Everything You Need to Find Your Direction</h2>
            <p>
              More than career suggestions. A complete guide
              to understanding and building your future.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="section-label">YOUR JOURNEY</span>
            <h2>Three Steps to a Clearer Future</h2>
            <p>Simple, personalized and designed around you.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <h3>Know Yourself</h3>
              <p>Share your interests, skills and academic strengths.</p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <h3>Discover Careers</h3>
              <p>Explore career recommendations based on your profile.</p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <h3>Build Your Future</h3>
              <p>Follow your personalized learning and career roadmap.</p>
            </div>
          </div>
        </section>

        {/* Assessment CTA */}
        <section className="assessment-section" id="assessment">
          <div>
            <span className="section-label">YOUR JOURNEY BEGINS HERE</span>
            <h2>Ready to Discover Your Potential?</h2>
            <p>
              Take the first step towards a career that matches
              your interests, strengths and ambitions.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowAssessment(true)}
            >
              Start Your Assessment <span>→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <button
          type="button"
          className="nav-button"
          onClick={() => setShowAssessment(true)}
        >
          Get Started <span>→</span>
        </button>
        <p>Helping students turn their potential into possibilities.</p>
        <span>© 2026 CareerCompass AI. All rights reserved.</span>
      </footer>

    </div>
  )
}

export default App
