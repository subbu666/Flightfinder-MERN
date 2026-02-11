import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Authenticate = () => {

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="authenticate-page">
      <div className="auth-background">
        <div className="gradient-overlay"></div>
        <div className="animated-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-logo">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="#d4af37" strokeWidth="2" fill="none"/>
              <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="#d4af37"/>
            </svg>
          </div>
          <h2>SB Flights</h2>
          <p>Premium Flight Booking Experience</p>
        </div>

        <div className="auth-form-wrapper">
          {isLogin ?
            <Login setIsLogin={setIsLogin} />
            :
            <Register setIsLogin={setIsLogin} />
          }
        </div>
      </div>

      <style>{`
        .authenticate-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 100px 20px 40px;
        }

        .auth-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0e27 0%, #141d4a 50%, #0a0e27 100%);
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(0, 212, 170, 0.06) 0%, transparent 50%);
        }

        .animated-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #00d4aa, #00aa88);
          bottom: 10%;
          right: -50px;
          animation-delay: -5s;
        }

        .shape-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          top: 40%;
          left: 30%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }

        .auth-container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          width: 100%;
          max-width: 500px;
        }

        .auth-brand {
          text-align: center;
          animation: fadeInDown 0.6s ease;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-logo {
          color: #d4af37;
          margin-bottom: 16px;
        }

        .auth-brand h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: white;
          margin-bottom: 8px;
        }

        .auth-brand p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
        }

        .auth-form-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .authenticate-page {
            padding: 80px 16px 32px;
          }

          .auth-brand h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Authenticate