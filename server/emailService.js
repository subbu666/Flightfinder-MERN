// emailService.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME;

/**
 * Send email via Brevo API
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL
        },
        to: [
          {
            email: to
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Brevo API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('✅ Email sent successfully via Brevo:', data.messageId);
    return {
      success: true,
      messageId: data.messageId
    };

  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

/**
 * Generate 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Get role display name and color
 */
const getRoleInfo = (usertype) => {
  const roles = {
    'customer': { name: 'Traveler', color: '#d4af37', icon: '✈️' },
    'flight-operator': { name: 'Flight Operator', color: '#00d4aa', icon: '🛫' },
    'admin': { name: 'Administrator', color: '#3b82f6', icon: '⚙️' }
  };
  return roles[usertype] || roles['customer'];
};

/**
 * Email template wrapper with premium styling
 */
const emailTemplate = (content, accentColor = '#d4af37') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SB Flights</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0a0e27 0%, #141d4a 50%, #0a0e27 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: transparent;
    }
    
    .email-content {
      background: linear-gradient(145deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      margin: 40px 20px;
      overflow: hidden;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
    }
    
    .email-header {
      background: linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%);
      padding: 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    .logo {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px ${accentColor}40;
    }
    
    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #0a0e27;
    }
    
    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      margin: 8px 0 0;
    }
    
    .email-body {
      padding: 40px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
    }
    
    .email-footer {
      background: rgba(255, 255, 255, 0.02);
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      margin: 32px 0;
    }
    
    .social-links {
      margin-top: 24px;
    }
    
    .social-links a {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin: 0 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      text-decoration: none;
      line-height: 36px;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }
    
    .footer-text {
      color: rgba(255, 255, 255, 0.4);
      font-size: 13px;
      margin: 20px 0 0;
    }
    
    .footer-links {
      margin-top: 16px;
    }
    
    .footer-links a {
      color: ${accentColor};
      text-decoration: none;
      margin: 0 12px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      <div class="email-header">
        <div class="logo">
          <div class="logo-text">SB</div>
        </div>
        <h1 class="brand-name">SB Flights</h1>
        <p class="tagline">Premium Flight Booking Experience</p>
      </div>
      
      <div class="email-body">
        ${content}
      </div>
      
      <div class="email-footer">
        <div class="divider"></div>
        <p class="footer-text">
          © 2026 SB Flights. All rights reserved.<br>
          Your trusted partner for premium air travel.
        </p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send OTP email for signup verification
 */
export const sendSignupOTP = async (email, username, usertype, otp) => {
  const roleInfo = getRoleInfo(usertype);
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 8px 20px; background: ${roleInfo.color}20; border: 1px solid ${roleInfo.color}40; border-radius: 100px; font-size: 14px; color: ${roleInfo.color}; margin-bottom: 24px;">
        ${roleInfo.icon} ${roleInfo.name}
      </div>
    </div>
    
    <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #ffffff; margin: 0 0 16px; text-align: center;">
      Verify Your Email
    </h2>
    
    <p style="text-align: center; font-size: 16px; color: rgba(255, 255, 255, 0.7); margin: 0 0 32px;">
      Hello <strong style="color: #ffffff;">${username}</strong>,<br>
      Welcome to SB Flights! Please verify your email address.
    </p>
    
    <div style="background: linear-gradient(135deg, ${roleInfo.color}15, ${roleInfo.color}08); border: 1px solid ${roleInfo.color}30; border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0;">
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">
        Your Verification Code
      </p>
      <div style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 700; color: ${roleInfo.color}; letter-spacing: 8px; margin: 0;">
        ${otp}
      </div>
      <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 16px 0 0;">
        This code expires in <strong style="color: ${roleInfo.color};">2 minutes</strong>
      </p>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px; margin-top: 32px;">
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0;">
        <strong style="color: rgba(255, 255, 255, 0.8);">Security Tip:</strong> Never share this code with anyone. SB Flights will never ask for your verification code.
      </p>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: rgba(255, 255, 255, 0.5); margin-top: 32px;">
      If you didn't request this, please ignore this email.
    </p>
  `;
  
  await sendEmail(
    email,
    `Verify Your SB Flights Account - OTP: ${otp}`,
    emailTemplate(content, roleInfo.color)
  );
};

/**
 * Send welcome email after successful signup
 */
export const sendWelcomeEmail = async (email, username, usertype) => {
  const roleInfo = getRoleInfo(usertype);
  
  const roleSpecificContent = {
    'customer': `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">🎫</div>
          <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">Book Flights</h4>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Search and book premium flights</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
          <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">Manage Bookings</h4>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Track and manage your trips</p>
        </div>
      </div>
    `,
    'flight-operator': `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">✈️</div>
          <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">Manage Flights</h4>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Add and update your flights</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
          <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">View Analytics</h4>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Track bookings and revenue</p>
        </div>
      </div>
      <div style="background: linear-gradient(135deg, ${roleInfo.color}15, ${roleInfo.color}08); border: 1px solid ${roleInfo.color}30; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin: 0;">
          <strong style="color: #ffffff;">⏳ Pending Approval:</strong> Your operator account is awaiting admin approval. You'll receive an email once approved.
        </p>
      </div>
    `,
    'admin': `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 32px 0;">
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 8px;">👥</div>
          <h4 style="color: #ffffff; font-size: 14px; margin: 0;">User Management</h4>
        </div>
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 8px;">✈️</div>
          <h4 style="color: #ffffff; font-size: 14px; margin: 0;">Flight Oversight</h4>
        </div>
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
          <h4 style="color: #ffffff; font-size: 14px; margin: 0;">System Analytics</h4>
        </div>
      </div>
    `
  };
  
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}dd); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 12px 32px ${roleInfo.color}40;">
        ${roleInfo.icon}
      </div>
    </div>
    
    <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; color: #ffffff; margin: 0 0 12px; text-align: center;">
      Welcome Aboard!
    </h2>
    
    <p style="text-align: center; font-size: 18px; color: rgba(255, 255, 255, 0.7); margin: 0 0 8px;">
      Hello <strong style="color: ${roleInfo.color};">${username}</strong>
    </p>
    
    <p style="text-align: center; font-size: 14px; color: rgba(255, 255, 255, 0.5); margin: 0 0 32px;">
      (<span style="color: ${roleInfo.color};">${roleInfo.name}</span>)
    </p>
    
    <p style="font-size: 16px; color: rgba(255, 255, 255, 0.7); line-height: 1.7; text-align: center; margin-bottom: 32px;">
      🎉 Your account has been successfully created!<br>
      Thank you for joining SB Flights, where premium travel meets exceptional service.
    </p>
    
    ${roleSpecificContent[usertype]}
    
    <div style="background: linear-gradient(135deg, #d4af37, #e4c158); border-radius: 14px; padding: 20px; text-align: center; margin: 32px 0;">
      <p style="color: #0a0e27; font-size: 15px; font-weight: 600; margin: 0;">
        🌟 Ready to start your journey? Log in to your account now!
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px;">
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0;">
        Need help getting started?<br>
        <a href="#" style="color: ${roleInfo.color}; text-decoration: none;">Visit our Help Center</a>
      </p>
    </div>
  `;
  
  await sendEmail(
    email,
    `🎉 Welcome to SB Flights, ${username}!`,
    emailTemplate(content, roleInfo.color)
  );
};

/**
 * Send forgot password OTP email
 */
export const sendForgotPasswordOTP = async (email, username, otp) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1)); border: 2px solid rgba(220, 53, 69, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px;">
        🔐
      </div>
    </div>
    
    <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #ffffff; margin: 0 0 16px; text-align: center;">
      Password Reset Request
    </h2>
    
    <p style="text-align: center; font-size: 16px; color: rgba(255, 255, 255, 0.7); margin: 0 0 32px;">
      Hello <strong style="color: #ffffff;">${username}</strong>,<br>
      We received a request to reset your password.
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.08)); border: 1px solid rgba(220, 53, 69, 0.3); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0;">
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">
        Your Reset Code
      </p>
      <div style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: 700; color: #ff6b7a; letter-spacing: 8px; margin: 0;">
        ${otp}
      </div>
      <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 16px 0 0;">
        This code expires in <strong style="color: #ff6b7a;">2 minutes</strong>
      </p>
    </div>
    
    <div style="background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.3); border-radius: 12px; padding: 20px; margin-top: 32px;">
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin: 0;">
        <strong style="color: #ff6b7a;">⚠️ Security Alert:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
      </p>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: rgba(255, 255, 255, 0.5); margin-top: 32px;">
      This code can only be used once. After resetting your password, you'll need to log in with your new credentials.
    </p>
  `;
  
  await sendEmail(
    email,
    `🔐 Reset Your SB Flights Password - OTP: ${otp}`,
    emailTemplate(content, '#ff6b7a')
  );
};

/**
 * Send operator approval notification
 */
export const sendOperatorApprovalEmail = async (email, username) => {
  const content = `
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 212, 170, 0.1)); border: 2px solid rgba(0, 212, 170, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px;">
        ✅
      </div>
    </div>
    
    <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #ffffff; margin: 0 0 16px; text-align: center;">
      Account Approved!
    </h2>
    
    <p style="text-align: center; font-size: 16px; color: rgba(255, 255, 255, 0.7); margin: 0 0 32px;">
      Hello <strong style="color: #00d4aa;">${username}</strong>,<br>
      Great news! Your flight operator account has been approved.
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 212, 170, 0.08)); border: 1px solid rgba(0, 212, 170, 0.3); border-radius: 16px; padding: 32px; text-align: center; margin: 32px 0;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <p style="font-size: 18px; color: #00d4aa; font-weight: 600; margin: 0 0 8px;">
        You're all set!
      </p>
      <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0;">
        You can now manage flights, view bookings, and access all operator features.
      </p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0;">
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 8px;">✈️</div>
        <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">Add Flights</h4>
        <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Start listing your flights</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
        <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px;">Track Bookings</h4>
        <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin: 0;">Monitor your performance</p>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #d4af37, #e4c158); border-radius: 14px; padding: 20px; text-align: center; margin: 32px 0;">
      <p style="color: #0a0e27; font-size: 15px; font-weight: 600; margin: 0;">
        🚀 Log in now to access your operator dashboard!
      </p>
    </div>
  `;
  
  await sendEmail(
    email,
    `✅ Your SB Flights Operator Account is Approved!`,
    emailTemplate(content, '#00d4aa')
  );
};

export default { 
  sendSignupOTP, 
  sendWelcomeEmail, 
  sendForgotPasswordOTP, 
  sendOperatorApprovalEmail 
};