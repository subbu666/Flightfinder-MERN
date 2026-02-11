import React, { useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const ForgotPassword = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [showResendLimit, setShowResendLimit] = useState(false);
  const inputRefs = React.useRef([]);
  const MAX_RESEND_ATTEMPTS = 2;

  // Password strength validation
  const validatePasswordStrength = (pwd) => {
    if (!pwd) return { isValid: false, score: 0 };

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
      hasVariety: new Set(pwd.split('')).size >= pwd.length * 0.7
    };

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

    score = Math.min(score, 100);

    return { isValid: score >= 70, score };
  };

  // Timer effect for OTP expiry
  React.useEffect(() => {
    if (step === 2 && timer > 0 && !isExpired) {
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
  }, [timer, step, isExpired]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error statuses with more specific messages
        if (response.status === 404) {
          throw new Error('No account exists with this email address. Please check and try again.');
        } else if (response.status === 403) {
          throw new Error('Your account is not verified. Please complete email verification first.');
        } else {
          throw new Error(data.message || 'Failed to send reset code. Please try again.');
        }
      }

      setStep(2);
      setTimer(120); // 2 minutes
      setCanResend(false);
      setIsExpired(false);
      setResendCount(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setTimer(120);
      setCanResend(false);
      setIsExpired(false);
      setOtp(['', '', '', '', '', '']);
      setResendCount(prev => prev + 1);
      setSuccessMessage('✨ New code sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerifyOTP = async () => {
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

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if error is about expiry
        if (data.message && data.message.toLowerCase().includes('expired')) {
          setIsExpired(true);
          setCanResend(true);
          throw new Error('⏰ Your OTP has expired! Please request a new code.');
        }
        throw new Error(data.message || 'Invalid OTP');
      }

      setStep(3);
    } catch (err) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      setError('Your password must be Strong or Very Strong. Please include uppercase, lowercase, numbers, and special characters.');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      // Show success message and close after 2 seconds
      onSuccess?.('Password reset successfully! Please login with your new password.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingAttempts = MAX_RESEND_ATTEMPTS - resendCount;

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-container" onClick={(e) => e.stopPropagation()}>
        <button className="fp-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="fp-content">
          {/* Step Indicator */}
          <div className="fp-steps">
            <div className={`fp-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="fp-step-circle">
                {step > 1 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : '1'}
              </div>
              <span className="fp-step-label">Email</span>
            </div>
            <div className="fp-step-line"></div>
            <div className={`fp-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="fp-step-circle">
                {step > 2 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : '2'}
              </div>
              <span className="fp-step-label">Verify</span>
            </div>
            <div className="fp-step-line"></div>
            <div className={`fp-step ${step >= 3 ? 'active' : ''}`}>
              <div className="fp-step-circle">3</div>
              <span className="fp-step-label">Reset</span>
            </div>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="fp-form">
              <div className="fp-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="rgba(212, 175, 55, 0.15)"/>
                  <path d="M18 18h12M18 24h8M18 30h10" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round"/>
                  <rect x="14" y="14" width="20" height="20" rx="3" stroke="#d4af37" strokeWidth="2"/>
                </svg>
              </div>

              <h2>Forgot Password?</h2>
              <p className="fp-subtitle">
                No worries! Enter your email address and we'll send you a code to reset your password.
              </p>

              {error && (
                <div className="fp-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group floating">
                <input 
                  type="email" 
                  className="form-control" 
                  id="fp-email" 
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="fp-email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email address
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-fp-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Sending...
                  </span>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="fp-form">
              <div className="fp-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="rgba(212, 175, 55, 0.15)"/>
                  <rect x="15" y="20" width="18" height="14" rx="2" stroke="#d4af37" strokeWidth="2.5"/>
                  <path d="M18 20V16a6 6 0 0 1 12 0v4" stroke="#d4af37" strokeWidth="2.5"/>
                </svg>
              </div>

              <h2>Enter Reset Code</h2>
              <p className="fp-subtitle">
                We've sent a 6-digit verification code to<br />
                <strong>{email}</strong>
              </p>

              {error && (
                <div className={`fp-error ${isExpired ? 'expired' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="fp-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {successMessage}
                </div>
              )}

              {showResendLimit && (
                <div className="fp-limit-reached">
                  <div className="limit-icon">🚫</div>
                  <div className="limit-content">
                    <h4>Resend Limit Reached</h4>
                    <p>You've used all {MAX_RESEND_ATTEMPTS} resend attempts. Please try again later or contact support.</p>
                  </div>
                </div>
              )}

              <div className="fp-otp-group">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`fp-otp-input ${isExpired ? 'expired' : ''}`}
                    disabled={isExpired}
                  />
                ))}
              </div>

              <div className="fp-timer-row">
                <div className={`fp-timer ${isExpired ? 'expired' : timer < 60 ? 'warning' : ''}`}>
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
                  type="button"
                  className={`fp-resend-btn ${resendCount >= MAX_RESEND_ATTEMPTS ? 'disabled' : ''}`}
                  onClick={handleResendOTP}
                  disabled={!canResend || isResending || resendCount >= MAX_RESEND_ATTEMPTS}
                >
                  {isResending ? (
                    <span className="fp-resend-spinner">
                      <span className="mini-spinner"></span>
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
                <div className="fp-resend-counter">
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
                <div className="fp-max-attempts-warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>All resend attempts exhausted. Please contact support if needed.</span>
                </div>
              )}

              <button 
                type="button"
                className="btn-fp-primary"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.some(d => !d) || isExpired}
              >
                {isLoading ? (
                  <span className="loading-spinner">
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

              <button 
                type="button"
                className="btn-fp-back"
                onClick={() => setStep(1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Email
              </button>

              <p className="fp-help-text">
                {isExpired 
                  ? '⚠️ Your code has expired. Click "Resend Code" to receive a new one.'
                  : 'Didn\'t receive the code? Check your spam folder or use resend after timer expires.'
                }
              </p>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="fp-form">
              <div className="fp-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="rgba(212, 175, 55, 0.15)"/>
                  <path d="M16 24l6 6 12-12" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2>Create New Password</h2>
              <p className="fp-subtitle">
                Choose a strong password to secure your account
              </p>

              {error && (
                <div className="fp-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group floating password-group">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-control" 
                  id="fp-new-password" 
                  placeholder=" "
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <label htmlFor="fp-new-password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  New Password
                </label>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && <PasswordStrengthIndicator password={newPassword} />}

              <div className="form-group floating password-group">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control" 
                  id="fp-confirm-password" 
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="fp-confirm-password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Confirm Password
                </label>
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`fp-password-match ${newPassword === confirmPassword ? 'match' : 'no-match'}`}>
                  {newPassword === confirmPassword ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      <span>Passwords don't match</span>
                    </>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-fp-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Resetting...
                  </span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .forgot-password-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 39, 0.95);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fpOverlayFadeIn 0.3s ease;
        }

        @keyframes fpOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .forgot-password-container {
          position: relative;
          width: 100%;
          max-width: 560px;
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.98) 0%, rgba(13, 17, 23, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.15);
          animation: fpSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes fpSlideUp {
          from { 
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .fp-close {
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

        .fp-close:hover {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.3);
          color: #d4af37;
          transform: rotate(90deg);
        }

        .fp-content {
          padding: 50px 40px 40px;
        }

        .fp-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .fp-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .fp-step-circle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .fp-step.active .fp-step-circle {
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-color: #d4af37;
          color: #0a0e27;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
        }

        .fp-step.completed .fp-step-circle {
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-color: #d4af37;
          color: #0a0e27;
        }

        .fp-step-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .fp-step.active .fp-step-label {
          color: #d4af37;
          font-weight: 600;
        }

        .fp-step.completed .fp-step-label {
          color: #d4af37;
        }

        .fp-step-line {
          width: 60px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 8px;
        }

        .fp-form {
          text-align: center;
        }

        .fp-icon {
          margin-bottom: 24px;
          animation: fpIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fpIconBounce {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fp-form h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: white;
          margin: 0 0 12px;
        }

        .fp-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 28px;
        }

        .fp-subtitle strong {
          color: #d4af37;
        }

        .fp-error {
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
          animation: fpErrorShake 0.5s ease;
          text-align: left;
        }

        .fp-error.expired {
          background: rgba(255, 152, 0, 0.12);
          border-color: rgba(255, 152, 0, 0.4);
          color: #ffa726;
          box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
        }

        @keyframes fpErrorShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }

        .fp-success {
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
          animation: fpSuccessFadeIn 0.4s ease;
          box-shadow: 0 0 20px rgba(0, 212, 170, 0.2);
        }

        @keyframes fpSuccessFadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .fp-limit-reached {
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

        .fp-otp-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .fp-otp-input {
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

        .fp-otp-input:focus {
          outline: none;
          background: rgba(212, 175, 55, 0.08);
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2), 0 4px 12px rgba(212, 175, 55, 0.3);
          transform: scale(1.05);
        }

        .fp-otp-input:not(:placeholder-shown) {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.08);
        }

        .fp-otp-input.expired {
          border-color: rgba(255, 152, 0, 0.3);
          background: rgba(255, 152, 0, 0.05);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .fp-timer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .fp-timer {
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

        .fp-timer.warning {
          color: #ff6b7a;
          border-color: rgba(255, 107, 122, 0.3);
          background: rgba(255, 107, 122, 0.1);
          animation: timerPulse 1s ease-in-out infinite;
        }

        .fp-timer.expired {
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

        .fp-resend-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
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

        .fp-resend-btn:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .fp-resend-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .fp-resend-btn.disabled {
          border-color: rgba(255, 107, 122, 0.3);
          color: #ff6b7a;
          background: rgba(255, 107, 122, 0.1);
        }

        .resend-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .fp-resend-spinner {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mini-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: fpSpin 0.8s linear infinite;
        }

        .fp-resend-counter {
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

        .fp-max-attempts-warning {
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

        .btn-fp-primary {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border: none;
          border-radius: 14px;
          color: #0a0e27;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
          margin-bottom: 16px;
        }

        .btn-fp-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
        }

        .btn-fp-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-fp-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-fp-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          width: 100%;
          margin-bottom: 12px;
        }

        .btn-fp-back:hover {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }

        .loading-spinner {
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
          animation: fpSpin 0.8s linear infinite;
        }

        @keyframes fpSpin {
          to { transform: rotate(360deg); }
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
          text-align: left;
        }

        .form-group.floating .form-control {
          width: 100%;
          height: 56px;
          padding: 28px 16px 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-group.floating .form-control:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          outline: none;
        }

        .form-group.floating label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.95rem;
          pointer-events: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group.floating label svg {
          opacity: 0.7;
        }

        .form-group.floating .form-control:focus ~ label,
        .form-group.floating .form-control:not(:placeholder-shown) ~ label {
          top: 10px;
          transform: translateY(0);
          font-size: 0.7rem;
          color: #d4af37;
        }

        .form-group.floating .form-control:focus ~ label svg,
        .form-group.floating .form-control:not(:placeholder-shown) ~ label svg {
          display: none;
        }

        .password-group {
          position: relative;
        }

        .password-group .form-control {
          padding-right: 48px !important;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
          z-index: 10;
        }

        .password-toggle:hover {
          color: #d4af37;
        }

        .fp-password-match {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          animation: matchFadeIn 0.3s ease;
          margin-bottom: 16px;
        }

        @keyframes matchFadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fp-password-match.match {
          background: rgba(0, 212, 170, 0.12);
          border: 1px solid rgba(0, 212, 170, 0.3);
          color: #00d4aa;
        }

        .fp-password-match.no-match {
          background: rgba(255, 107, 122, 0.12);
          border: 1px solid rgba(255, 107, 122, 0.3);
          color: #ff6b7a;
        }

        .fp-help-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 12px 0 0;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 480px) {
          .forgot-password-container {
            margin: 0 16px;
          }

          .fp-content {
            padding: 40px 24px 32px;
          }

          .fp-form h2 {
            font-size: 1.5rem;
          }

          .fp-otp-input {
            width: 46px;
            height: 54px;
            font-size: 1.5rem;
          }

          .fp-otp-group {
            gap: 8px;
          }

          .fp-step-line {
            width: 40px;
          }

          .fp-timer-row {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .fp-timer {
            justify-content: center;
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

export default ForgotPassword;