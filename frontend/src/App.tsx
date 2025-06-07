import './App.css'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import React, { useState } from 'react'
import SignupModal from './SignupModal'

function App() {
  const [showSignup, setShowSignup] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Handler for signup completion
  const handleSignupComplete = () => {
    setIsLoggedIn(true)
    setShowSignup(false)
  }

  return (
    <div className="landing-root">
      <Navbar onSignupClick={() => setShowSignup(true)} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Kazi Pay:<br />The Payment Lifeline<br />for Global Freelancers</h1>
          <p className="subtitle">
            Building trust in remote work. Milestone based crypto payouts for global freelancers powered by XRP Ledger.
          </p>
          <div className="hero-actions">
            <button className="primary-btn">FREELANCER</button>
            <button className="secondary-btn">CLIENT</button>
          </div>
        </div>
        <div className="hero-logo">
          {/* Placeholder SVG for KAZI PAY logo */}
          <svg width="260" height="120" viewBox="0 0 260 120">
            <rect x="60" y="20" width="180" height="80" fill="#0099b8" rx="4" />
            <text x="80" y="65" fontSize="40" fontWeight="bold" fill="#fff">KAZI</text>
            <text x="140" y="100" fontSize="28" fontWeight="bold" fill="#fff">PAY</text>
            <rect x="20" y="40" width="30" height="20" fill="#0099b8" />
            <rect x="10" y="60" width="40" height="10" fill="#0099b8" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-label">Active users</div>
          <div className="stat-value">500K+</div>
          <div className="stat-avatars">
            {/* Placeholder avatars */}
            <span className="avatar" style={{background:'#fbbf24'}}></span>
            <span className="avatar" style={{background:'#60a5fa'}}></span>
            <span className="avatar" style={{background:'#f87171'}}></span>
            <span className="avatar" style={{background:'#a78bfa'}}></span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Transactions processed</div>
          <div className="stat-value">2M+</div>
          <div className="stat-icon">
            {/* Money icon */}
            <span role="img" aria-label="money">💵</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Freelancers paid globally</div>
          <div className="stat-value">1M+</div>
          <div className="stat-icon">
            {/* Handshake icon */}
            <span role="img" aria-label="handshake">🤝</span>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="trusted-section">
        <div className="trusted-label">Trusted by</div>
        <div className="trusted-marquee">
          <div className="trusted-track">
            <span className="trusted-company">HERDAO</span>
            <span className="trusted-company">Ripple</span>
            <span className="trusted-company">EasyA</span>
            <span className="trusted-company">XRPLEDGER</span>
            <span className="trusted-company">HERDAO</span>
            <span className="trusted-company">Ripple</span>
            <span className="trusted-company">EasyA</span>
            <span className="trusted-company">XRPLEDGER</span>
          </div>
        </div>
      </section>
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} onSignupComplete={handleSignupComplete} />
    </div>
  )
}

export default App
