import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import custom CSS

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container text-center">
          <h1 className="hero-title">Empower Your Business with CRM Pro</h1>
          <p className="hero-subtitle">
            The ultimate solution for managing customer relationships, sales pipelines, and marketing campaigns.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg hero-cta-btn">
            Get Started for Free
          </Link>
          <p className="mt-3">
            <small>No credit card required. Cancel anytime.</small>
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Why Choose CRM Pro?</h2>
            <p>Everything you need to grow your business, in one place.</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Customer Management</h3>
                <p>Get a 360-degree view of your customers. Track interactions, manage contacts, and build stronger relationships.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Sales Pipeline</h3>
                <p>Visualize your sales process, track deals from lead to close, and forecast revenue with accuracy.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <h3>Marketing Automation</h3>
                <p>Create, automate, and measure marketing campaigns. Nurture leads and drive more sales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Loved by Businesses Worldwide</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="testimonial-card">
                <p>"CRM Pro has transformed the way we manage our sales. Our productivity has increased by 40%!"</p>
                <div className="testimonial-author">
                  <strong>- Sarah Johnson</strong>, CEO of TechCorp
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="testimonial-card">
                <p>"The best CRM we've ever used. It's intuitive, powerful, and the support team is fantastic."</p>
                <div className="testimonial-author">
                  <strong>- Mark Williams</strong>, Sales Director at Innovate Ltd.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>Ready to Take Control of Your Customer Data?</h2>
          <p>Join thousands of businesses and start your journey with CRM Pro today.</p>
          <Link to="/register" className="btn btn-light btn-lg cta-btn">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
