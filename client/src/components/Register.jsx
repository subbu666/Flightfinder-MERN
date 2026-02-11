import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';
import OTPModal from './OTPModal';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import api from '../config/axios';

const Register = ({setIsLogin}) => {

  const {username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype, showSuccess, showError} = useContext(GeneralContext);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (step === 1 && usertype) {
      setStep(2);
      return;
    }
    
    // Step 2: Validate and send OTP
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      showError(
        'Weak Password', 
        'Your password must be Strong or Very Strong. Please include uppercase, lowercase, numbers, and special characters.'
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showError(
        'Passwords Don\'t Match', 
        'Please ensure both password fields are identical.'
      );
      return;
    }

    setIsLoading(true);
    try {
      // First create temp user entry
      await api.post('/create-temp-user', { email, username, usertype });
      
      // Send OTP
      const response = await api.post('/send-signup-otp', { 
        email, 
        username, 
        usertype 
      });
      
      setTempUserData({ username, email, usertype, password });
      setShowOTPModal(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showError('Registration Failed', err.response?.data?.message || 'Failed to send verification code');
    }
  }

  const handleOTPVerify = async (otp) => {
    try {
      const response = await api.post('/verify-otp-register', {
        email: tempUserData.email,
        otp,
        username: tempUserData.username,
        usertype: tempUserData.usertype,
        password: tempUserData.password
      });

      const user = response.data;
      
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userType', user.usertype);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);

      setShowOTPModal(false);
      showSuccess('Registration Successful!', `Welcome ${user.username}! Your account has been created.`);
      
      setTimeout(() => {
        if(user.usertype === 'customer'){
          window.location.href = '/';
        } else if(user.usertype === 'admin'){
          window.location.href = '/admin';
        } else if(user.usertype === 'flight-operator'){
          window.location.href = '/flight-admin';
        }
      }, 1500);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleOTPResend = async () => {
    try {
      await api.post('/resend-otp', {
        email: tempUserData.email,
        username: tempUserData.username,
        usertype: tempUserData.usertype
      });
      showSuccess('OTP Resent', 'A new verification code has been sent to your email');
    } catch (err) {
      throw new Error('Failed to resend OTP');
    }
  };

  const userTypes = [
    { value: 'customer', label: 'Traveler', icon: '✈️', desc: 'Book flights and manage trips' },
    { value: 'flight-operator', label: 'Flight Operator', icon: '🛫', desc: 'Manage flights and bookings' },
    { value: 'admin', label: 'Administrator', icon: '⚙️', desc: 'System administration' }
  ];

  return (
    <>
      <form className="auth-form register" onSubmit={handleRegister}>
        <div className="auth-form-header">
          <div className="auth-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(0, 212, 170, 0.15)"/>
              <path d="M16 24h16M24 16v16" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Join us for premium flight experiences</p>
        </div>

        <div className="auth-form-body">
          {step === 1 ? (
            <div className="user-type-selection">
              <label className="selection-label">Select your account type</label>
              <div className="user-type-grid">
                {userTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`user-type-card ${usertype === type.value ? 'selected' : ''}`}
                    onClick={() => setUsertype(type.value)}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <div className="type-content">
                      <span className="type-label">{type.label}</span>
                      <span className="type-desc">{type.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <input type="hidden" value={usertype} required />
            </div>
          ) : (
            <>
              <div className="form-group floating">
                <input 
                  type="text" 
                  className="form-control" 
                  id="username" 
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name
                </label>
              </div>

              <div className="form-group floating">
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email address
                </label>
              </div>

              <div className="form-group floating password-group">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-control" 
                  id="password" 
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Create Password
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
              {password && <PasswordStrengthIndicator password={password} />}

              <div className="form-group floating password-group">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control" 
                  id="confirmPassword" 
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="confirmPassword">
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
                <div className={`password-match-indicator ${password === confirmPassword ? 'match' : 'no-match'}`}>
                  {password === confirmPassword ? (
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
                type="button" 
                className="btn-back"
                onClick={() => {
                  setStep(1);
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back
              </button>
            </>
          )}

          <button 
            type="submit" 
            className="btn-premium btn-signup"
            disabled={isLoading || (step === 1 && !usertype)}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Sending verification...
              </span>
            ) : step === 1 ? (
              <>
                <span>Continue</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </div>

        <div className="auth-form-footer">
          <div className="divider">
            <span>or</span>
          </div>
          <p className="switch-auth">
            Already have an account? 
            <span onClick={() => {setIsLogin(true); setStep(1); setPassword(''); setConfirmPassword('');}}>Sign In</span>
          </p>
        </div>

        <style>{`
          .auth-form {
            width: 100%;
            max-width: 420px;
            background: linear-gradient(145deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1);
            animation: formSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes formSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .auth-form.register {
            max-width: 500px;
          }

          .auth-form-header {
            text-align: center;
            margin-bottom: 32px;
          }

          .auth-icon {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }

          .auth-form-header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            color: white;
            margin-bottom: 8px;
          }

          .auth-form-header p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.95rem;
            margin: 0;
          }

          .auth-form-body {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .user-type-selection {
            margin-bottom: 8px;
          }

          .selection-label {
            display: block;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 16px;
            text-align: center;
          }

          .user-type-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .user-type-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.04);
            border: 1.5px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .user-type-card:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(0, 212, 170, 0.4);
            transform: translateY(-2px);
          }

          .user-type-card.selected {
            background: rgba(0, 212, 170, 0.12);
            border-color: #00d4aa;
            box-shadow: 0 0 24px rgba(0, 212, 170, 0.2), 0 8px 16px rgba(0, 0, 0, 0.2);
          }

          .type-icon {
            font-size: 2rem;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }

          .user-type-card.selected .type-icon {
            background: rgba(0, 212, 170, 0.15);
          }

          .type-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
          }

          .type-label {
            color: white;
            font-size: 0.95rem;
            font-weight: 600;
          }

          .type-desc {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.8rem;
            line-height: 1.3;
          }

          .form-group {
            position: relative;
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
            border-color: #00d4aa;
            box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.15);
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
            color: #00d4aa;
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
            color: rgba(255, 255, 255, 0.8);
          }

          .password-match-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            animation: matchFadeIn 0.3s ease;
            margin-top: -8px;
          }

          @keyframes matchFadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .password-match-indicator.match {
            background: rgba(0, 212, 170, 0.12);
            border: 1px solid rgba(0, 212, 170, 0.3);
            color: #00d4aa;
          }

          .password-match-indicator.no-match {
            background: rgba(255, 107, 122, 0.12);
            border: 1px solid rgba(255, 107, 122, 0.3);
            color: #ff6b7a;
          }

          .btn-back {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            align-self: flex-start;
            border-radius: 8px;
          }

          .btn-back:hover {
            color: #00d4aa;
            background: rgba(0, 212, 170, 0.1);
          }

          .btn-signup {
            width: 100%;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 8px;
          }

          .btn-signup:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .auth-form-footer {
            margin-top: 28px;
          }

          .divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
          }

          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          }

          .divider span {
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .switch-auth {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.95rem;
            margin: 0;
          }

          .switch-auth span {
            color: #d4af37;
            font-weight: 600;
            cursor: pointer;
            margin-left: 6px;
            transition: all 0.3s ease;
          }

          .switch-auth span:hover {
            color: #00f4ca;
            text-decoration: underline;
          }

          @media (max-width: 480px) {
            .auth-form {
              padding: 28px 24px;
              margin: 0 16px;
            }

            .auth-form-header h2 {
              font-size: 1.6rem;
            }

            .type-icon {
              font-size: 1.5rem;
              width: 40px;
              height: 40px;
            }
          }
        `}</style>
      </form>

      {/* OTP Modal */}
      <OTPModal 
        show={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={tempUserData?.email}
        username={tempUserData?.username}
        usertype={tempUserData?.usertype}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        type="signup"
      />
    </>
  )
}

export default Register;