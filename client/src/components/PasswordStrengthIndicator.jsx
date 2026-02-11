import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '', gradient: '' };

    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(pwd),
      longLength: pwd.length >= 12,
      veryLongLength: pwd.length >= 16,
      ultraLongLength: pwd.length >= 20,
      hasMultipleNumbers: (pwd.match(/\d/g) || []).length >= 2,
      hasMultipleSpecial: (pwd.match(/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/g) || []).length >= 2,
      hasMultipleUpper: (pwd.match(/[A-Z]/g) || []).length >= 2,
      hasMultipleLower: (pwd.match(/[a-z]/g) || []).length >= 3,
      noRepeats: !/(.)\1{2,}/.test(pwd),
      noSequential: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pwd),
      hasVariety: new Set(pwd.split('')).size >= pwd.length * 0.7 // At least 70% unique characters
    };

    // Enhanced Scoring system to reach 100
    if (checks.length) score += 12;
    if (checks.hasLower) score += 8;
    if (checks.hasUpper) score += 8;
    if (checks.hasNumber) score += 8;
    if (checks.hasSpecial) score += 12;
    if (checks.longLength) score += 10;
    if (checks.veryLongLength) score += 10;
    if (checks.ultraLongLength) score += 8;
    if (checks.hasMultipleNumbers) score += 5;
    if (checks.hasMultipleSpecial) score += 5;
    if (checks.hasMultipleUpper) score += 4;
    if (checks.hasMultipleLower) score += 4;
    if (checks.noRepeats) score += 3;
    if (checks.noSequential) score += 3;
    if (checks.hasVariety) score += 0; // Placeholder for perfect score calculation
    
    // Cap at 100
    score = Math.min(score, 100);

    // Determine strength level
    if (score < 30) {
      return {
        score,
        level: 0,
        label: 'Very Weak',
        color: '#ff4757',
        gradient: 'linear-gradient(135deg, #ff4757, #ff6b7a)',
        checks,
        isAcceptable: false,
        isPerfect: false
      };
    } else if (score < 50) {
      return {
        score,
        level: 1,
        label: 'Weak',
        color: '#ffa502',
        gradient: 'linear-gradient(135deg, #ffa502, #ffb732)',
        checks,
        isAcceptable: false,
        isPerfect: false
      };
    } else if (score < 70) {
      return {
        score,
        level: 2,
        label: 'Moderate',
        color: '#ffd93d',
        gradient: 'linear-gradient(135deg, #ffd93d, #ffe66d)',
        checks,
        isAcceptable: false,
        isPerfect: false
      };
    } else if (score < 85) {
      return {
        score,
        level: 3,
        label: 'Strong',
        color: '#6bcf7f',
        gradient: 'linear-gradient(135deg, #6bcf7f, #7ee08f)',
        checks,
        isAcceptable: true,
        isPerfect: false
      };
    } else if (score < 100) {
      return {
        score,
        level: 4,
        label: 'Very Strong',
        color: '#00d4aa',
        gradient: 'linear-gradient(135deg, #00d4aa, #00f4ca)',
        checks,
        isAcceptable: true,
        isPerfect: false
      };
    } else {
      return {
        score: 100,
        level: 5,
        label: 'Perfect',
        color: '#d4af37',
        gradient: 'linear-gradient(135deg, #d4af37, #e4c158, #f4d56e)',
        checks,
        isAcceptable: true,
        isPerfect: true
      };
    }
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  const getRequirementStatus = (met) => met ? '✓' : '×';
  const getRequirementClass = (met) => met ? 'req-met' : 'req-unmet';

  return (
    <div className="password-strength-container">
      {/* Strength Bar */}
      <div className="strength-bar-wrapper">
        <div className="strength-bar-track">
          <div 
            className={`strength-bar-fill ${strength.isPerfect ? 'perfect-glow' : ''}`}
            style={{
              width: `${strength.score}%`,
              background: strength.gradient,
              boxShadow: strength.isPerfect 
                ? `0 0 30px ${strength.color}80, 0 0 60px ${strength.color}40` 
                : `0 0 20px ${strength.color}40`
            }}
          >
            <div className="strength-bar-shimmer"></div>
          </div>
        </div>
        <div className="strength-label-row">
          <span className={`strength-label ${strength.isPerfect ? 'perfect-pulse' : ''}`} style={{ color: strength.color }}>
            {strength.isPerfect && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="perfect-star">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            )}
            {strength.label}
            {strength.isPerfect && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="perfect-star">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            )}
          </span>
          <span className={`strength-score ${strength.isPerfect ? 'perfect-score' : ''}`}>{strength.score}/100</span>
        </div>
      </div>

      {/* Perfect Password Celebration */}
      {strength.isPerfect && (
        <div className="perfect-celebration">
          <div className="celebration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#d4af37"/>
            </svg>
          </div>
          <div className="celebration-text">
            <span className="celebration-title">Exceptional Password!</span>
            <span className="celebration-subtitle">Maximum security achieved</span>
          </div>
          <div className="celebration-sparkles">
            <span className="sparkle sparkle-1">✨</span>
            <span className="sparkle sparkle-2">✨</span>
            <span className="sparkle sparkle-3">✨</span>
            <span className="sparkle sparkle-4">✨</span>
          </div>
        </div>
      )}

      {/* Requirements Grid */}
      <div className="requirements-grid">
        <div className={`requirement ${getRequirementClass(strength.checks.length)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.length)}</span>
          <span className="req-text">8+ characters</span>
        </div>
        <div className={`requirement ${getRequirementClass(strength.checks.hasUpper)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.hasUpper)}</span>
          <span className="req-text">Uppercase letter</span>
        </div>
        <div className={`requirement ${getRequirementClass(strength.checks.hasLower)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.hasLower)}</span>
          <span className="req-text">Lowercase letter</span>
        </div>
        <div className={`requirement ${getRequirementClass(strength.checks.hasNumber)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.hasNumber)}</span>
          <span className="req-text">Number</span>
        </div>
        <div className={`requirement ${getRequirementClass(strength.checks.hasSpecial)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.hasSpecial)}</span>
          <span className="req-text">Special character</span>
        </div>
        <div className={`requirement ${getRequirementClass(strength.checks.noSequential)}`}>
          <span className="req-icon">{getRequirementStatus(strength.checks.noSequential)}</span>
          <span className="req-text">No sequential chars</span>
        </div>
      </div>

      {/* Premium Enhancement Badge */}
      {strength.checks.longLength && !strength.isPerfect && (
        <div className="premium-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Enhanced Security
        </div>
      )}

      <style>{`
        .password-strength-container {
          margin-top: 12px;
          animation: strengthFadeIn 0.4s ease;
        }

        @keyframes strengthFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .strength-bar-wrapper {
          margin-bottom: 16px;
        }

        .strength-bar-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .strength-bar-fill {
          height: 100%;
          border-radius: 10px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .strength-bar-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .strength-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .strength-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
        }

        .strength-score {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          font-family: 'Courier New', monospace;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .requirement {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 0.8rem;
        }

        .requirement.req-met {
          background: rgba(0, 212, 170, 0.08);
          border-color: rgba(0, 212, 170, 0.2);
        }

        .requirement.req-met .req-icon {
          color: #00d4aa;
          background: rgba(0, 212, 170, 0.15);
        }

        .requirement.req-unmet .req-icon {
          color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .req-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.75rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .req-text {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1;
          transition: color 0.3s ease;
        }

        .requirement.req-met .req-text {
          color: rgba(255, 255, 255, 0.8);
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(228, 193, 88, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          color: #d4af37;
          font-size: 0.75rem;
          font-weight: 600;
          animation: badgeSlideIn 0.4s ease 0.2s backwards;
        }

        @keyframes badgeSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .premium-badge svg {
          animation: badgeSpin 3s linear infinite;
        }

        @keyframes badgeSpin {
          0%, 90% { transform: rotate(0deg); }
          95% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }

        /* Perfect Password Effects */
        .strength-bar-fill.perfect-glow {
          animation: perfectGlow 2s ease-in-out infinite;
        }

        @keyframes perfectGlow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(212, 175, 55, 1), 0 0 80px rgba(212, 175, 55, 0.6);
          }
        }

        .strength-label.perfect-pulse {
          display: flex;
          align-items: center;
          gap: 6px;
          animation: perfectPulse 1.5s ease-in-out infinite;
        }

        @keyframes perfectPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .perfect-star {
          fill: #d4af37;
          animation: starRotate 3s linear infinite;
        }

        @keyframes starRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .perfect-score {
          font-weight: 700;
          color: #d4af37 !important;
          animation: scoreGlow 2s ease-in-out infinite;
        }

        @keyframes scoreGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); }
          50% { text-shadow: 0 0 20px rgba(212, 175, 55, 0.8); }
        }

        .perfect-celebration {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(228, 193, 88, 0.15));
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 12px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
          animation: celebrationSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes celebrationSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .perfect-celebration::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          animation: celebrationShine 3s infinite;
        }

        @keyframes celebrationShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .celebration-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(228, 193, 88, 0.2));
          border-radius: 10px;
          animation: celebrationIconBounce 2s ease-in-out infinite;
        }

        @keyframes celebrationIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .celebration-icon svg {
          animation: celebrationStarSpin 4s linear infinite;
        }

        @keyframes celebrationStarSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .celebration-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .celebration-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #d4af37;
          letter-spacing: 0.3px;
        }

        .celebration-subtitle {
          font-size: 0.75rem;
          color: rgba(212, 175, 55, 0.7);
        }

        .celebration-sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 1rem;
          animation: sparkleFloat 3s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 60%;
          right: 20%;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          bottom: 15%;
          left: 25%;
          animation-delay: 1s;
        }

        .sparkle-4 {
          top: 30%;
          right: 10%;
          animation-delay: 1.5s;
        }

        @keyframes sparkleFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-30px) rotate(360deg);
            opacity: 0;
          }
        }

        @media (max-width: 480px) {
          .requirements-grid {
            grid-template-columns: 1fr;
          }
          
          .requirement {
            padding: 6px 10px;
          }

          .celebration-title {
            font-size: 0.85rem;
          }

          .celebration-subtitle {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PasswordStrengthIndicator;