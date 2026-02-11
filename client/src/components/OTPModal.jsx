import React, { useState, useEffect, useRef } from 'react';

const OTPModal = ({ 
  show, 
  onClose, 
  email, 
  username, 
  usertype, 
  onVerify, 
  onResend,
  type = 'signup' // 'signup' or 'reset'
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [showResendLimit, setShowResendLimit] = useState(false);
  const inputRefs = useRef([]);
  const MAX_RESEND_ATTEMPTS = 2;

  useEffect(() => {
    if (show) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setSuccessMessage('');
      setTimer(120);
      setCanResend(false);
      setIsExpired(false);
      setResendCount(0);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [show]);

  useEffect(() => {
    if (timer > 0 && show && !isExpired) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsExpired(true);
            setCanResend(true);
            setError('⏰ Your OTP has expired! Please request a new code.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, show, isExpired]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    if (isExpired) {
      setError('⏰ This OTP has expired! Please request a new code to continue.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      await onVerify(otpString);
      // After successful verification, close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      // Check if error is about expiry
      if (err.message && err.message.toLowerCase().includes('expired')) {
        setIsExpired(true);
        setCanResend(true);
        setError('⏰ Your OTP has expired! Please request a new code.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      setShowResendLimit(true);
      setTimeout(() => setShowResendLimit(false), 5000);
      return;
    }
    
    setIsResending(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await onResend();
      setTimer(120);
      setCanResend(false);
      setIsExpired(false);
      setOtp(['', '', '', '', '', '']);
      setResendCount(prev => prev + 1);
      setSuccessMessage('✨ New code sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoleColor = () => {
    if (type === 'reset') return '#ff6b7a';
    const colors = {
      'customer': '#d4af37',
      'flight-operator': '#00d4aa',
      'admin': '#3b82f6'
    };
    return colors[usertype] || '#d4af37';
  };

  // Helper function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const roleColor = getRoleColor();
  const remainingAttempts = MAX_RESEND_ATTEMPTS - resendCount;

  if (!show) return null;

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="otp-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="otp-modal-content">
          <div className="otp-icon-wrapper" style={{
            '--role-color': roleColor,
            '--role-color-15': hexToRgba(roleColor, 0.15),
            '--role-color-08': hexToRgba(roleColor, 0.08),
            '--role-color-40': hexToRgba(roleColor, 0.4),
            '--role-color-30': hexToRgba(roleColor, 0.3)
          }}>
            <div className="otp-icon-circle">
              {type === 'reset' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={roleColor} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={roleColor} strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              )}
            </div>
            <div className="otp-icon-ripple"></div>
          </div>

          <h2 className="otp-modal-title">
            {type === 'reset' ? 'Enter Reset Code' : 'Verify Your Email'}
          </h2>
          
          <p className="otp-modal-subtitle">
            {type === 'reset' 
              ? `We've sent a verification code to ${email}`
              : `A 6-digit code has been sent to ${email}`
            }
          </p>

          {error && (
            <div className={`otp-error ${isExpired ? 'expired' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="otp-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {successMessage}
            </div>
          )}

          {showResendLimit && (
            <div className="otp-limit-reached">
              <div className="limit-icon">🚫</div>
              <div className="limit-content">
                <h4>Resend Limit Reached</h4>
                <p>You've used all {MAX_RESEND_ATTEMPTS} resend attempts. Please try again later or contact support if you need assistance.</p>
              </div>
            </div>
          )}

          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`otp-input ${isExpired ? 'expired' : ''}`}
                style={{
                  '--role-color': roleColor,
                  '--role-color-20': hexToRgba(roleColor, 0.2),
                  '--role-color-30': hexToRgba(roleColor, 0.3),
                  '--role-color-08': hexToRgba(roleColor, 0.08)
                }}
                disabled={isExpired}
              />
            ))}
          </div>

          <div className="otp-timer-row">
            <div className={`otp-timer ${isExpired ? 'expired' : timer < 60 ? 'warning' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {isExpired ? (
                <span className="expired-text">Expired</span>
              ) : (
                formatTime(timer)
              )}
            </div>
            
            <button 
              className={`otp-resend-btn ${resendCount >= MAX_RESEND_ATTEMPTS ? 'disabled' : ''}`}
              onClick={handleResend}
              disabled={!canResend || isResending || resendCount >= MAX_RESEND_ATTEMPTS}
              style={{
                '--role-color': roleColor,
                '--role-color-30': hexToRgba(roleColor, 0.3),
                '--role-color-15': hexToRgba(roleColor, 0.15),
                '--role-color-50': hexToRgba(roleColor, 0.5)
              }}
            >
              {isResending ? (
                <span className="otp-resend-spinner">
                  <span className="mini-spinner" style={{'--role-color': roleColor, '--role-color-30': hexToRgba(roleColor, 0.3)}}></span>
                  Sending...
                </span>
              ) : canResend && resendCount < MAX_RESEND_ATTEMPTS ? (
                <span className="resend-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Resend Code
                </span>
              ) : resendCount >= MAX_RESEND_ATTEMPTS ? (
                'Limit Reached'
              ) : (
                `Resend in ${formatTime(timer)}`
              )}
            </button>
          </div>

          {/* Resend Attempts Counter */}
          {resendCount > 0 && resendCount < MAX_RESEND_ATTEMPTS && (
            <div className="resend-counter">
              <div className="counter-bar">
                <div 
                  className="counter-fill" 
                  style={{
                    width: `${(resendCount / MAX_RESEND_ATTEMPTS) * 100}%`,
                    background: resendCount === 1 ? 'linear-gradient(90deg, #d4af37, #e4c158)' : 'linear-gradient(90deg, #ff6b7a, #ff8a94)'
                  }}
                ></div>
              </div>
              <div className="counter-text">
                <span className="attempts-used">{resendCount} of {MAX_RESEND_ATTEMPTS} resend attempts used</span>
                <span className="attempts-remaining">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining
                </span>
              </div>
            </div>
          )}

          {resendCount >= MAX_RESEND_ATTEMPTS && (
            <div className="max-attempts-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>All resend attempts exhausted. Please contact support if needed.</span>
            </div>
          )}

          {/* VERIFY BUTTON */}
          <button 
            className="otp-verify-btn"
            onClick={handleVerify}
            disabled={isVerifying || otp.some(d => !d) || isExpired}
            style={{
              '--role-color': roleColor,
              '--role-color-light': hexToRgba(roleColor, 0.9),
              '--role-color-shadow': hexToRgba(roleColor, 0.4),
              '--role-color-hover-shadow': hexToRgba(roleColor, 0.5)
            }}
          >
            {isVerifying ? (
              <span className="otp-loading-spinner">
                <span className="spinner"></span>
                Verifying...
              </span>
            ) : (
              <>
                <span>Verify Code</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </>
            )}
          </button>

          <p className="otp-help-text">
            {isExpired 
              ? '⚠️ Your code has expired. Click "Resend Code" to receive a new one.'
              : 'Didn\'t receive the code? Check your spam folder or use resend after timer expires.'
            }
          </p>
        </div>
      </div>

      <style>{`
        .otp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 39, 0.95);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: otpOverlayFadeIn 0.3s ease;
        }

        @keyframes otpOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .otp-modal-container {
          position: relative;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.98) 0%, rgba(13, 17, 23, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.15);
          animation: otpModalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes otpModalSlideUp {
          from { 
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .otp-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .otp-modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: rotate(90deg);
        }

        .otp-modal-content {
          padding: 50px 40px 40px;
          text-align: center;
        }

        .otp-icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 28px;
        }

        .otp-icon-circle {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--role-color-15), var(--role-color-08));
          border: 2px solid var(--role-color-40);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: otpIconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }

        @keyframes otpIconPop {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .otp-icon-ripple {
          position: absolute;
          inset: 0;
          border: 2px solid var(--role-color-30);
          border-radius: 50%;
          animation: otpRipple 1.5s ease-out 0.3s infinite;
        }

        @keyframes otpRipple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .otp-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          margin: 0 0 12px;
          animation: otpFadeInUp 0.5s ease 0.3s backwards;
        }

        .otp-modal-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 32px;
          line-height: 1.5;
          animation: otpFadeInUp 0.5s ease 0.4s backwards;
        }

        @keyframes otpFadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .otp-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: rgba(220, 53, 69, 0.12);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 12px;
          color: #ff6b7a;
          font-size: 0.85rem;
          margin-bottom: 20px;
          animation: otpErrorShake 0.5s ease;
        }

        .otp-error.expired {
          background: rgba(255, 152, 0, 0.12);
          border-color: rgba(255, 152, 0, 0.4);
          color: #ffa726;
          box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
        }

        @keyframes otpErrorShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }

        .otp-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 212, 170, 0.08));
          border: 1px solid rgba(0, 212, 170, 0.4);
          border-radius: 12px;
          color: #00d4aa;
          font-size: 0.85rem;
          margin-bottom: 20px;
          animation: otpSuccessFadeIn 0.4s ease;
          box-shadow: 0 0 20px rgba(0, 212, 170, 0.2);
        }

        @keyframes otpSuccessFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .otp-limit-reached {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.08));
          border: 2px solid rgba(220, 53, 69, 0.3);
          border-radius: 16px;
          margin-bottom: 20px;
          animation: limitPulse 0.6s ease;
        }

        @keyframes limitPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .limit-icon {
          font-size: 2rem;
          animation: limitIconRotate 0.5s ease;
        }

        @keyframes limitIconRotate {
          from { transform: rotate(-20deg); }
          to { transform: rotate(0deg); }
        }

        .limit-content {
          flex: 1;
          text-align: left;
        }

        .limit-content h4 {
          color: #ff6b7a;
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 8px;
        }

        .limit-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }

        .otp-input-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 24px;
          animation: otpFadeInUp 0.5s ease 0.5s backwards;
        }

        .otp-input {
          width: 54px;
          height: 62px;
          background: rgba(255, 255, 255, 0.04);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
        }

        .otp-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--role-color);
          box-shadow: 0 0 0 3px var(--role-color-20), 0 4px 12px var(--role-color-30);
          transform: scale(1.05);
        }

        .otp-input:not(:placeholder-shown) {
          border-color: var(--role-color);
          background: var(--role-color-08);
        }

        .otp-input.expired {
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.05);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .otp-timer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          animation: otpFadeInUp 0.5s ease 0.6s backwards;
        }

        .otp-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .otp-timer.warning {
          color: #ff6b7a;
          border-color: rgba(255, 107, 122, 0.3);
          background: rgba(255, 107, 122, 0.1);
          animation: timerPulse 1s ease-in-out infinite;
        }

        .otp-timer.expired {
          color: #ffa726;
          border-color: rgba(255, 152, 0, 0.4);
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.08));
          box-shadow: 0 0 15px rgba(255, 152, 0, 0.3);
        }

        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .expired-text {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .otp-resend-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--role-color-30);
          color: var(--role-color);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .otp-resend-btn:hover:not(:disabled) {
          background: var(--role-color-15);
          border-color: var(--role-color-50);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--role-color-30);
        }

        .otp-resend-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .otp-resend-btn.disabled {
          border-color: rgba(255, 107, 122, 0.3);
          color: #ff6b7a;
          background: rgba(255, 107, 122, 0.1);
        }

        .resend-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .otp-resend-spinner {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--role-color-30);
          border-top-color: var(--role-color);
          border-radius: 50%;
          animation: otpSpin 0.8s linear infinite;
        }

        .resend-counter {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.03));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 14px;
          margin-bottom: 20px;
          animation: counterFadeIn 0.4s ease;
        }

        @keyframes counterFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .counter-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .counter-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .counter-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .attempts-used {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .attempts-remaining {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #d4af37;
          font-weight: 600;
        }

        .max-attempts-warning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(255, 107, 122, 0.15), rgba(255, 107, 122, 0.08));
          border: 1px solid rgba(255, 107, 122, 0.3);
          border-radius: 12px;
          color: #ff6b7a;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 20px;
          animation: warningPulse 2s ease-in-out infinite;
        }

        @keyframes warningPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 107, 122, 0); }
          50% { box-shadow: 0 0 20px rgba(255, 107, 122, 0.4); }
        }

        .otp-verify-btn {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--role-color), var(--role-color-light));
          border: none;
          border-radius: 14px;
          color: #0a0e27;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px var(--role-color-shadow);
          animation: otpFadeInUp 0.5s ease 0.7s backwards;
          margin-bottom: 20px;
        }

        .otp-verify-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px var(--role-color-hover-shadow);
          filter: brightness(1.1);
        }

        .otp-verify-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .otp-verify-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .otp-loading-spinner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10, 14, 39, 0.3);
          border-top-color: #0a0e27;
          border-radius: 50%;
          animation: otpSpin 0.8s linear infinite;
        }

        @keyframes otpSpin {
          to { transform: rotate(360deg); }
        }

        .otp-help-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
          line-height: 1.6;
          animation: otpFadeInUp 0.5s ease 0.8s backwards;
        }

        @media (max-width: 480px) {
          .otp-modal-container {
            margin: 0 16px;
          }

          .otp-modal-content {
            padding: 40px 24px 32px;
          }

          .otp-modal-title {
            font-size: 1.5rem;
          }

          .otp-input {
            width: 46px;
            height: 54px;
            font-size: 1.5rem;
          }

          .otp-input-group {
            gap: 8px;
          }

          .otp-timer-row {
            flex-direction: column;
            gap: 12px;
          }

          .counter-text {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPModal;