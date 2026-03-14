import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  const features = [
    {
      icon: '😊',
      title: 'Mood Tracking',
      description: 'Track your daily mood with emojis and notes to understand your emotional patterns'
    },
    {
      icon: '🧠',
      title: 'Mental Health Screenings',
      description: 'Take evidence-based assessments to understand your mental health status'
    },
    {
      icon: '🎥',
      title: 'Educational Videos',
      description: 'Access expert-led psychological content to support your mental health journey'
    },
    {
      icon: '🏆',
      title: 'Gamified Experience',
      description: 'Earn points, unlock achievements, and build streaks to stay motivated'
    },
    {
      icon: '💬',
      title: 'AI Chat Support',
      description: 'Get instant support and guidance from our AI-powered mental health assistant'
    },
    {
      icon: '🔒',
      title: 'Anonymous & Private',
      description: 'Your privacy is our priority. Use the platform completely anonymously'
    }
  ];

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🌟 Welcome to MindConnect
            <span className="hero-subtitle">Your Mental Health Companion</span>
          </h1>
          <p className="hero-description">
            A gamified mental health platform designed specifically for students. 
            Track your mood, access resources, and build healthy habits in a supportive environment.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="cta-button primary">
              🚀 Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              🔒 Login Anonymously
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-element">😊</div>
            <div className="floating-element">🧘</div>
            <div className="floating-element">💪</div>
            <div className="floating-element">🌟</div>
            <div className="floating-element">🎯</div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">✨ Why Choose MindConnect?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Students Helped</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Anonymous & Private</div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Mental Health Journey?</h2>
          <p>Join thousands of students who have already improved their mental well-being with MindConnect.</p>
          <Link to="/dashboard" className="cta-button primary large">
            🌟 Start Your Journey Today
          </Link>
        </div>
      </div>
    </div>
  );
}
