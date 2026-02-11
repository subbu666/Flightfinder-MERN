import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Booking, Flight } from './schemas.js';
import { 
  generateOTP, 
  sendSignupOTP, 
  sendWelcomeEmail, 
  sendForgotPasswordOTP,
  sendOperatorApprovalEmail 
} from './emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

/* =======================
   Middleware
======================= */
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   MongoDB Connection
======================= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

/* =======================
   OTP Expiry Validation Helper
======================= */
const checkOTPExpiry = (otpExpiry) => {
  if (!otpExpiry) {
    return { expired: true, message: '⏰ OTP has expired. Please request a new one.' };
  }
  
  const now = new Date();
  const expiryTime = new Date(otpExpiry);
  
  if (now > expiryTime) {
    return { expired: true, message: '⏰ Your OTP has expired! Please request a new code.' };
  }
  
  return { expired: false };
};

/* =======================
   Authentication Routes
======================= */

// Send OTP for signup
app.post('/send-signup-otp', async (req, res) => {
  const { email, username, usertype } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate OTP with 2-minute expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // If user exists but not verified, update OTP
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    }

    // Send OTP email
    await sendSignupOTP(email, username, usertype, otp);

    res.json({ 
      message: 'OTP sent successfully',
      email,
      tempData: { username, usertype } // Return for frontend to store temporarily
    });
  } catch (err) {
    console.error('Send OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP and Register
app.post('/verify-otp-register', async (req, res) => {
  const { email, otp, username, usertype, password } = req.body;

  try {
    // Check if user exists with unverified account
    let user = await User.findOne({ email });
    
    // If no user exists, return error
    if (!user) {
      return res.status(400).json({ message: 'Please request OTP first' });
    }

    // Check OTP expiry FIRST (before validating OTP correctness)
    const expiryCheck = checkOTPExpiry(user.otpExpiry);
    if (expiryCheck.expired) {
      return res.status(400).json({ message: expiryCheck.message });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Determine approval status
    let approval = usertype === 'flight-operator' ? 'not-approved' : 'approved';

    // Update user
    user.username = username;
    user.usertype = usertype;
    user.password = hashedPassword;
    user.approval = approval;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(email, username, usertype);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      approval: user.approval,
      isVerified: user.isVerified
    });
  } catch (err) {
    console.error('Verify OTP Error:', err.message);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// Create user entry for OTP (called before sending OTP)
app.post('/create-temp-user', async (req, res) => {
  const { email, username, usertype } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!existingUser) {
      // Create temporary unverified user
      const tempUser = await User.create({
        username,
        email,
        usertype,
        password: 'temp', // Will be updated on verification
        approval: usertype === 'flight-operator' ? 'not-approved' : 'approved',
        isVerified: false
      });
    }

    res.json({ message: 'Temporary user created' });
  } catch (err) {
    console.error('Create Temp User Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend OTP for signup
app.post('/resend-otp', async (req, res) => {
  const { email, username, usertype } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Generate new OTP with 2-minute expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendSignupOTP(email, username, usertype, otp);

    res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email first',
        needsVerification: true,
        email: user.email
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      approval: user.approval
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Send OTP
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your account first' });
    }

    // Generate OTP with 2-minute expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send forgot password OTP email
    await sendForgotPasswordOTP(email, user.username, otp);

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    res.status(500).json({ message: 'Failed to send reset code' });
  }
});

// Verify Forgot Password OTP
app.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP expiry FIRST (before validating OTP correctness)
    const expiryCheck = checkOTPExpiry(user.otpExpiry);
    if (expiryCheck.expired) {
      return res.status(400).json({ message: expiryCheck.message });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify Reset OTP Error:', err.message);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// Reset Password
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP expiry FIRST (before validating OTP correctness)
    const expiryCheck = checkOTPExpiry(user.otpExpiry);
    if (expiryCheck.expired) {
      return res.status(400).json({ message: expiryCheck.message });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

/* =======================
   Operator Management
======================= */

// Approve operator (sends email notification)
app.post('/approve-operator', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.id, 
      { approval: 'approved' },
      { new: true }
    );
    
    // Send approval email
    await sendOperatorApprovalEmail(user.email, user.username);
    
    res.json({ message: 'Approved!' });
  } catch (err) {
    console.error('Approve Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject operator
app.post('/reject-operator', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, { approval: 'rejected' });
    res.json({ message: 'Rejected!' });
  } catch (err) {
    console.error('Reject Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =======================
   User Routes
======================= */

// Fetch users
app.get('/fetch-users', async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Fetch Users Error:', err.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Fetch user
app.get('/fetch-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error('Fetch User Error:', err.message);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

/* =======================
   Flight Routes
======================= */

// Add flight
app.post('/add-flight', async (req, res) => {
  try {
    const {
      flightName,
      flightId,
      origin,
      destination,
      journeyDate,
      departureTime,
      arrivalTime,
      basePrice,
      totalSeats
    } = req.body;

    if (
      !flightName ||
      !flightId ||
      !origin ||
      !destination ||
      !journeyDate ||
      !departureTime ||
      !arrivalTime ||
      !basePrice ||
      !totalSeats
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await Flight.create({
      flightName,
      flightId,
      origin,
      destination,
      journeyDate: new Date(journeyDate),
      departureTime,
      arrivalTime,
      basePrice,
      totalSeats
    });

    res.json({ message: 'Flight added successfully' });
  } catch (err) {
    console.error('Add Flight Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Update flight
app.put('/update-flight', async (req, res) => {
  try {
    await Flight.findByIdAndUpdate(req.body._id, req.body);
    res.json({ message: 'Flight updated successfully' });
  } catch (err) {
    console.error('Update Flight Error:', err.message);
    res.status(500).json({ message: 'Error updating flight' });
  }
});

// Fetch flights
app.get('/fetch-flights', async (req, res) => {
  try {
    let flights;
    if (req.query.date) {
      const start = new Date(req.query.date + 'T00:00:00.000Z');
      const end   = new Date(req.query.date + 'T23:59:59.999Z');
      flights = await Flight.find({ journeyDate: { $gte: start, $lte: end } });
    } else {
      flights = await Flight.find();
    }
    res.json(flights);
  } catch (err) {
    console.error('Fetch Flights Error:', err.message);
    res.status(500).json({ message: 'Error fetching flights' });
  }
});

// Fetch flight
app.get('/fetch-flight/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    res.json(flight);
  } catch (err) {
    console.error('Fetch Flight Error:', err.message);
    res.status(500).json({ message: 'Error fetching flight' });
  }
});

/* =======================
   Booking Routes
======================= */

// Fetch bookings
app.get('/fetch-bookings', async (_, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    console.error('Fetch Bookings Error:', err.message);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Book ticket
app.post('/book-ticket', async (req, res) => {
  try {
    const { flight, journeyDate, seatClass, passengers } = req.body;

    const bookings = await Booking.find({ flight, journeyDate, seatClass });
    const count = bookings.reduce((a, b) => a + b.passengers.length, 0);

    const seatMap = {
      economy: 'E',
      'premium-economy': 'P',
      business: 'B',
      'first-class': 'A'
    };

    const seats = passengers
      .map((_, i) => `${seatMap[seatClass]}-${count + i + 1}`)
      .join(', ');

    await Booking.create({ ...req.body, seats });
    res.json({ message: 'Booking successful' });
  } catch (err) {
    console.error('Booking Error:', err.message);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// Cancel ticket
app.put('/cancel-ticket/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      bookingStatus: 'cancelled'
    });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('Cancel Error:', err.message);
    res.status(500).json({ message: 'Cancel failed' });
  }
});

/* =======================
   Server
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
