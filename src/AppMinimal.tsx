// Ultra-minimal App for CSS testing
import { HelmetProvider } from "react-helmet-async";

const AppMinimal = () => (
  <HelmetProvider>
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0C53ED 0%, #2A869E 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Shalean Cleaning Services
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Professional cleaning services in Cape Town
        </p>
        <div style={{ 
          background: 'white', 
          color: '#0C53ED', 
          padding: '1rem 2rem', 
          borderRadius: '50px', 
          display: 'inline-block',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Book Now
        </div>
      </div>
    </div>
  </HelmetProvider>
);

export default AppMinimal;
