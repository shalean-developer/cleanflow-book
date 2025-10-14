// Ultra-minimal App with no external dependencies
import React from 'react';

const AppUltraMinimal = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0C53ED 0%, #2A869E 100%)', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        textAlign: 'center', 
        color: 'white',
        paddingTop: '4rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Shalean Cleaning Services
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2rem', 
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Professional cleaning services in Cape Town
        </p>
        <div style={{ 
          background: 'white', 
          color: '#0C53ED', 
          padding: '1rem 2rem', 
          borderRadius: '50px', 
          display: 'inline-block',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Book Now
        </div>
        
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Why Choose Us?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h3>Fully Insured</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3>Quality Guaranteed</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
              <h3>Flexible Scheduling</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUltraMinimal;
