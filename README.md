# ✈️ Flight Finder: Navigating Your Air Travel Options

A full-stack flight booking platform built with the MERN stack, offering a premium flight booking experience with comprehensive role-based access control. The application features distinct interfaces for customers, flight operators, and administrators, providing seamless flight search, booking, and management capabilities.

![Flight Finder](https://img.shields.io/badge/Status-Production%20Ready-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-lightgrey)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple)

---

## 📋 Table of Contents

- [Video Demonstration](#video-demonstration)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Key Features Implementation](#key-features-implementation)
- [Styling Architecture](#styling-architecture)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [Support](#support)
- [Show Your Support](#show-your-support)

---

## 🎬Video Demonstration

<div align="center">

### 📺 See Flight Finder in Action

Experience the complete platform walkthrough showcasing all features, user roles, and the seamless booking flow.

<br>

[![Watch Demo Video](https://img.shields.io/badge/▶️_WATCH_FULL_DEMO-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/1h285CpdYYGbDBQH7M-KCZArhUie81IPC/view?usp=sharing)

<br>

**🎯 What's Covered in the Demo:**
- Customer flight search and booking process
- Flight operator dashboard and flight management
- Admin panel and operator approval workflow
- Real-time booking management and cancellations
- Responsive design across different devices

*Duration: Full platform walkthrough | Quality: HD*

</div>

---

## ✨Features

### 🎯 Core Features

#### For Customers
- **Advanced Flight Search**: Search flights with flexible date selection and return journey options
- **Smart Route Filtering**: Intelligent filtering based on departure, destination, and journey dates
- **Real-time Availability**: Live flight availability and seat information
- **Multi-class Booking**: Support for Economy, Premium Economy, Business, and First Class
- **Booking Management**: View, manage, and cancel bookings with confirmation tracking
- **Passenger Management**: Add multiple passengers per booking with detailed information
- **Price Calculation**: Dynamic pricing based on class multipliers and passenger count
- **Journey Visualization**: Interactive flight route display with departure and arrival times

#### For Flight Operators
- **Operator Dashboard**: Comprehensive overview of flights and bookings
- **Flight Management**: Create, edit, and manage flight routes
- **Booking Overview**: Track all bookings for operator's flights
- **Approval System**: Operator registration requires admin approval
- **Route Configuration**: Set departure/arrival times, pricing, and seat capacity
- **Real-time Updates**: Instant reflection of booking changes

#### For Administrators
- **Admin Dashboard**: Complete system overview with statistics
- **User Management**: View and manage all registered users (customers, operators, admins)
- **Operator Approval**: Approve or reject flight operator applications
- **Booking Oversight**: Monitor all bookings across the platform
- **Flight Monitoring**: View all flights in the system
- **Analytics**: User count, booking count, and active flight statistics

### 🎨 UI/UX Features
- **Premium Design**: Modern, gradient-based design with smooth animations
- **Responsive Layout**: Fully responsive across desktop, tablet, and mobile devices
- **Bootstrap Integration**: Leveraging Bootstrap 5 for responsive grid and components
- **Interactive Components**: Hover effects, transitions, and micro-interactions
- **Modal System**: Custom modal system for confirmations and alerts
- **Loading States**: Elegant loading animations and spinners
- **Error Handling**: User-friendly error messages and validation
- **Flight Animations**: Engaging flight path animations during search
- **Status Badges**: Visual indicators for booking and approval status

---

## 🛠Tech Stack

### Frontend
- **React 18.x** - UI library with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **Context API** - State management across components
- **Bootstrap 5.x** - CSS framework for responsive design and components
- **Custom CSS** - Component-specific styling with modular CSS files

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud-based NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ES6+ JavaScript** - Modern JavaScript features
- **Async/Await** - Asynchronous programming
- **RESTful API** - API design pattern
- **Git** - Version control

---

## 📁Project Structure
```
FlightFinder-Navigating-Your-Air-Travel-Options/
│
├── server/                         # Backend application (Node.js + Express)
│   ├── index.js                    # Express server entry point & API routes
│   ├── schemas.js                  # Mongoose models (User, Flight, Booking)
│   ├── emailService.js             # Handles email sending (OTP, password reset)
│   ├── .env                        # Backend environment variables
│   ├── package.json                # Backend dependencies
│   └── node_modules/               # Backend packages
│
└── client/                         # Frontend application (React)
    │
    ├── public/                     # Static public assets
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    │
    ├── src/                        # React source files
    │   │
    │   ├── assets/                 # Static assets (images, icons)
    │   │
    │   ├── config/                 # Centralized configuration files
    │   │   ├── api.js              # Backend API base URL configuration
    │   │   └── axios.js            # Axios instance with auth & error handling
    │   │
    │   ├── components/             # Reusable UI components
    │   │   ├── Login.jsx                   # Customer login component
    │   │   ├── Register.jsx                # User registration with role selection
    │   │   ├── ForgotPassword.jsx          # Initiates password reset via email OTP
    │   │   ├── OTPModal.jsx                # OTP verification modal component
    │   │   ├── Navbar.jsx                  # Role-based dynamic navigation
    │   │   └── PremiumModal.jsx            # Reusable premium feature modal
    │   │
    │   ├── context/                # React Context API state management
    │   │   └── GeneralContext.jsx          # Global state (auth, modals, bookings)
    │   │
    │   ├── pages/                  # Main application pages
    │   │   ├── Admin.jsx
    │   │   ├── AllBookings.jsx
    │   │   ├── AllFlights.jsx
    │   │   ├── AllUsers.jsx
    │   │   ├── Authenticate.jsx
    │   │   ├── BookFlight.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── EditFlight.jsx
    │   │   ├── FlightAdmin.jsx
    │   │   ├── FlightBookings.jsx
    │   │   ├── Flights.jsx
    │   │   ├── LandingPage.jsx
    │   │   └── NewFlight.jsx
    │   │
    │   ├── RouteProtectors/         # Route access control
    │   │   ├── AuthProtector.jsx
    │   │   └── LoginProtector.jsx
    │   │
    │   ├── styles/                 # Component & page-specific CSS
    │   │   ├── Admin.css
    │   │   ├── AllFlights.css
    │   │   ├── AllUsers.css
    │   │   ├── Authenticate.css
    │   │   ├── BookFlight.css
    │   │   ├── Bookings.css
    │   │   ├── FlightAdmin.css
    │   │   ├── LandingPage.css
    │   │   ├── Navbar.css
    │   │   └── NewFlight.css
    │   │
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── index.css
    │   ├── index.js
    │   ├── logo.svg
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    │
    ├── .env                        # Frontend environment variables
    ├── package.json
    ├── package-lock.json
    └── node_modules/
```

### Directory Structure Explanation

#### Server Directory (`/server`)
- **`index.js`**: Main Express server file containing all API endpoints and middleware configuration
- **`schemas.js`**: Mongoose schema definitions for User, Flight, and Booking models
- **`.env`**: Environment variables for database connection and server configuration
- **`package.json`**: Backend dependencies including Express, Mongoose, bcrypt, CORS, and dotenv

#### Client Directory (`/client`)

**`/public`**: Static files served directly by the web server
- Contains HTML template, favicons, and PWA manifest

**`/src/components`**: Reusable React components used across multiple pages
- **Login.jsx**: Handles user authentication with email and password
- **Register.jsx**: Multi-step registration with user type selection
- **Navbar.jsx**: Dynamically renders navigation based on user role
- **PremiumModal.jsx**: Reusable modal component for alerts and confirmations

**`/src/context`**: Global state management using React Context API
- **GeneralContext.jsx**: Provides authentication state, user data, and modal functions throughout the app

**`/src/pages`**: Full-page components representing different routes
- Each page component handles a specific feature or user flow
- Pages are role-specific and protected by route guards

**`/src/RouteProtectors`**: Authentication and authorization components
- **AuthProtector.jsx**: Prevents unauthorized access to protected routes
- **LoginProtector.jsx**: Redirects authenticated users away from login page

**`/src/styles`**: Modular CSS files for component-specific styling
- Each page component has its own dedicated CSS file
- Follows a consistent naming convention matching component names
- Contains responsive styles, animations, and theme customizations

---

## 🚀Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/flightfinder-navigating-your-air-travel-options.git
cd flightfinder-navigating-your-air-travel-options
```

### Step 2: Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `server/.env` file:
```env
PORT=6001
MONGO_URI=your_mongodb_atlas_connection_string
```

### Step 3: Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install frontend dependencies
npm install
```

### Step 4: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:6001
```

**Terminal 2 - Frontend Application:**
```bash
cd client
npm start
# Application opens at http://localhost:3000
```

---

## Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button
6. Replace `<username>`, `<password>`, and `<database>` in the connection string
7. Add the complete connection string to `server/.env`

### Environment Variables

**Server `.env` (in `/server` directory):**
```env
PORT=6001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

### API Base URL Configuration

**Development**: The frontend is configured to use `http://localhost:6001`

**Production**: Update the API base URL in frontend Axios requests:
```javascript
// In client/src/context/GeneralContext.jsx and page components
// Change from:
await axios.get('http://localhost:6001/fetch-flights')

// To:
await axios.get('https://your-backend-domain.com/fetch-flights')
```

---

## 📖Usage

### User Registration & Login

1. **New Users**: Navigate to `/auth` and click "Create Account"
   - **Step 1**: Select account type:
     - **Traveler (Customer)**: For booking flights
     - **Flight Operator**: For managing flights (requires admin approval)
     - **Administrator**: For system management
   - **Step 2**: Enter personal details (name, email, password)
   - **Submit**: Account is created and you're automatically logged in

2. **Existing Users**: Navigate to `/auth` and click "Sign In"
   - Enter registered email and password
   - System redirects based on user role

### Customer Workflow

1. **Search Flights**:
   - On the landing page, fill in the search form:
     - Select **From** city (departure)
     - Select **To** city (destination)
     - Choose **Departure Date**
     - Toggle **Return Journey** for round trips (optional)
     - If return trip, select **Return Date**
   - Click **Search Flights**
   - View animated flight search process
   - See results summary modal

2. **Book Flight**:
   - Browse available flights in search results
   - Review flight details: airline, route, times, price
   - Click **Book Now** on desired flight
   - Fill in booking form:
     - **Contact Information**: Email and mobile number
     - **Journey Details**: Confirm date, number of passengers, travel class
     - **Passenger Information**: Name and age for each passenger
   - Review total price calculation
   - Click **Confirm Booking**

3. **Manage Bookings**:
   - Navigate to **My Bookings** from the navigation menu
   - View all your bookings with status indicators
   - See booking details: flight info, passengers, price
   - **Cancel Booking**: Click cancel button for active bookings
   - Confirmation modal appears before cancellation

### Flight Operator Workflow

1. **Initial Setup**:
   - Register as a Flight Operator
   - Wait for admin approval (you'll see a "Pending Approval" message)
   - Once approved, access the operator dashboard

2. **Add New Flight**:
   - Navigate to **Add New Flight**
   - Fill in flight details:
     - **Flight ID**: Unique identifier (e.g., FL001)
     - **Route**: Departure city, destination city
     - **Schedule**: Journey date, departure time, arrival time
     - **Pricing**: Base price per passenger
     - **Capacity**: Total number of seats
   - Click **Add Flight**
   - Flight appears in your flights list

3. **Manage Existing Flights**:
   - Go to **My Flights** to see all your flights
   - Each flight card shows: route, times, price, available seats
   - Click **Edit Flight** to modify details
   - Update any field and save changes

4. **Monitor Bookings**:
   - Navigate to **Bookings** to see all bookings for your flights
   - View passenger details, contact information
   - Track booking status and journey dates
   - Cancel bookings if necessary

### Administrator Workflow

1. **Dashboard Overview**:
   - View system statistics:
     - Total Users
     - Total Bookings
     - Active Flights
   - See pending operator approval requests
   - Quick access to all management sections

2. **Approve Flight Operators**:
   - Pending applications appear in the dashboard
   - Review operator details (name, email)
   - Click **Approve** to grant operator access
   - Click **Reject** to deny the application
   - Confirmation modal appears before action

3. **User Management**:
   - Navigate to **Users**
   - Switch between tabs:
     - **Customers**: View all customer accounts
     - **Operators**: View all flight operator accounts
     - **Admins**: View all administrator accounts
   - See user details, approval status, and user IDs

4. **Booking Management**:
   - Go to **Bookings** to view all bookings in the system
   - Filter and search through bookings
   - View complete booking details
   - Cancel bookings on behalf of users if needed

5. **Flight Oversight**:
   - Navigate to **Flights** to see all flights
   - View complete flight information in table format
   - Monitor flight operators and their routes
   - Track system-wide flight availability

---

## 🔌API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Register new user | `{username, email, usertype, password}` | User object |
| POST | `/login` | User login | `{email, password}` | User object |

### User Management Routes
| Method | Endpoint | Description | Authorization | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/fetch-users` | Get all users | Admin | - |
| GET | `/fetch-user/:id` | Get user by ID | Authenticated | - |
| POST | `/approve-operator` | Approve flight operator | Admin | `{id}` |
| POST | `/reject-operator` | Reject flight operator | Admin | `{id}` |

### Flight Management Routes
| Method | Endpoint | Description | Authorization | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/add-flight` | Create new flight | Operator | `{flightName, flightId, origin, destination, journeyDate, departureTime, arrivalTime, basePrice, totalSeats}` |
| PUT | `/update-flight` | Update flight details | Operator | `{_id, ...updateFields}` |
| GET | `/fetch-flights` | Get all flights | Public | Query: `?date=YYYY-MM-DD` (optional) |
| GET | `/fetch-flight/:id` | Get flight by ID | Public | - |

### Booking Management Routes
| Method | Endpoint | Description | Authorization | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/book-ticket` | Create new booking | Customer | `{user, flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, seatClass}` |
| GET | `/fetch-bookings` | Get all bookings | Authenticated | - |
| PUT | `/cancel-ticket/:id` | Cancel booking | Customer/Admin | - |

### Query Parameters

**`/fetch-flights?date=YYYY-MM-DD`**
- Filters flights by journey date
- Returns only flights on the specified date
- Uses MongoDB date range query for accurate matching

---

## Database Schema

### User Model
```javascript
{
  username: String,          // Full name of the user
  email: String,             // Unique email address (used for login)
  usertype: String,          // 'customer', 'admin', or 'flight-operator'
  password: String,          // Hashed password using bcrypt
  approval: String           // 'approved', 'not-approved', or 'rejected'
}
```

**Indexes**: `email` (unique)

### Flight Model
```javascript
{
  flightName: String,        // Airline/operator name
  flightId: String,          // Unique flight identifier (e.g., FL001)
  origin: String,            // Departure city
  destination: String,       // Arrival city
  journeyDate: Date,         // Date of the flight (YYYY-MM-DD)
  departureTime: String,     // Departure time (HH:MM)
  arrivalTime: String,       // Arrival time (HH:MM)
  basePrice: Number,         // Base price per passenger
  totalSeats: Number         // Total available seats
}
```

### Booking Model
```javascript
{
  user: ObjectId,            // Reference to User model
  flight: ObjectId,          // Reference to Flight model
  flightName: String,        // Cached flight name
  flightId: String,          // Cached flight ID
  departure: String,         // Departure city
  destination: String,       // Destination city
  email: String,             // Contact email
  mobile: String,            // Contact mobile number
  seats: String,             // Assigned seat numbers (e.g., "E-1, E-2")
  passengers: [{
    name: String,            // Passenger full name
    age: Number              // Passenger age
  }],
  totalPrice: Number,        // Total booking price
  bookingDate: Date,         // When the booking was made
  journeyDate: Date,         // Date of travel
  journeyTime: String,       // Departure time for the journey
  seatClass: String,         // 'economy', 'premium-economy', 'business', 'first-class'
  bookingStatus: String      // 'confirmed' or 'cancelled'
}
```

---

## 🔐Key Features Implementation

### 1. Dynamic Pricing System
```javascript
// Price multipliers by class
const priceMultipliers = {
  'economy': 1,
  'premium-economy': 2,
  'business': 3,
  'first-class': 4
};

// Total calculation
totalPrice = basePrice × classMultiplier × numberOfPassengers
```

### 2. Automatic Seat Allocation
```javascript
// Seat prefixes by class
const seatPrefixes = {
  'economy': 'E',
  'premium-economy': 'P',
  'business': 'B',
  'first-class': 'A'
};

// Example output: "B-1, B-2, B-3"
```

### 3. Role-Based Access Control

**Route Protection**:
- Public: Landing page, authentication
- Customer: Booking, my bookings
- Operator: Flight management (requires approval)
- Admin: System management, approvals

---

## 🎨Styling Architecture

### CSS Organization

The application uses a modular CSS architecture with separate stylesheets for each component, located in the `client/src/styles/` directory:
```
client/src/styles/
├── Admin.css          → Styles for Admin.jsx
├── AllFlights.css     → Styles for AllFlights.jsx
├── AllUsers.css       → Styles for AllUsers.jsx
├── Authenticate.css   → Styles for Authenticate.jsx
├── BookFlight.css     → Styles for BookFlight.jsx
├── Bookings.css       → Styles for Bookings.jsx
├── FlightAdmin.css    → Styles for FlightAdmin.jsx
├── LandingPage.css    → Styles for LandingPage.jsx
├── Navbar.css         → Styles for Navbar.jsx
└── NewFlight.css      → Styles for NewFlight.jsx
```

### Import Structure

Each page component imports its corresponding CSS file from the styles folder:
```javascript
// Example: src/pages/Admin.jsx
import React from 'react';
import '../styles/Admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      {/* Component JSX */}
    </div>
  );
};

export default Admin;
```
```javascript
// Example: src/pages/LandingPage.jsx
import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Component JSX */}
    </div>
  );
};

export default LandingPage;
```

### Styling Approach

**1. Bootstrap Foundation**
```javascript
// client/src/index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
```
- Provides responsive grid system
- Pre-built components (modals, cards, buttons)
- Utility classes for spacing and layout

**2. Global Styles**
```css
/* src/index.css - Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0a0e27;
  color: white;
}
```

**3. Component-Specific Styles**
Each component has its own CSS file in the `styles/` folder:
```css
/* src/styles/LandingPage.css */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
}

.hero-section {
  padding: 100px 5% 60px;
  position: relative;
}

.search-card {
  background: linear-gradient(145deg, rgba(22, 27, 34, 0.9), rgba(13, 17, 23, 0.95));
  border-radius: 24px;
  padding: 32px;
}
```
```css
/* src/styles/Navbar.css */
.premium-navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background: transparent;
  transition: all 0.4s ease;
}

.premium-navbar.scrolled {
  background: rgba(10, 14, 39, 0.85);
  backdrop-filter: blur(20px);
}
```

### Component-to-CSS Mapping

| Component | CSS File | Key Classes |
|-----------|----------|-------------|
| **Admin.jsx** | Admin.css | `.admin-page`, `.stat-card`, `.requests-section` |
| **AllFlights.jsx** | AllFlights.css | `.all-flights-page`, `.flights-table`, `.flight-cell` |
| **AllUsers.jsx** | AllUsers.css | `.all-users-page`, `.user-card`, `.tabs-container` |
| **Authenticate.jsx** | Authenticate.css | `.authenticate-page`, `.auth-form`, `.auth-brand` |
| **BookFlight.jsx** | BookFlight.css | `.book-flight-page`, `.booking-form`, `.passenger-form` |
| **Bookings.jsx** | Bookings.css | `.bookings-page`, `.booking-card`, `.route-info` |
| **FlightAdmin.jsx** | FlightAdmin.css | `.flight-admin-page`, `.status-message`, `.stat-card` |
| **LandingPage.jsx** | LandingPage.css | `.landing-page`, `.hero-section`, `.flights-grid` |
| **Navbar.jsx** | Navbar.css | `.premium-navbar`, `.nav-link`, `.mobile-menu-btn` |
| **NewFlight.jsx** | NewFlight.css | `.new-flight-page`, `.flight-form`, `.form-actions` |

### Design Tokens

**Colors** (defined across CSS files)
```css
:root {
  --primary-gold: #d4af37;
  --secondary-teal: #00d4aa;
  --bg-dark: #0a0e27;
  --bg-secondary: #0f1538;
  --card-bg: rgba(22, 27, 34, 0.9);
  --error-red: #dc3545;
  --warning-orange: #f59e0b;
  --success-green: #00d4aa;
}
```

**Typography**
```css
/* Headings */
font-family: 'Playfair Display', serif;

/* Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Spacing Scale**
- Small: 8px, 12px, 16px
- Medium: 20px, 24px, 32px
- Large: 40px, 48px, 60px

**Border Radius**
- Small: 8px, 10px, 12px
- Medium: 14px, 16px, 20px
- Large: 24px, 28px

### Responsive Design

All CSS files in the `styles/` folder include mobile-first responsive breakpoints:
```css
/* Mobile First - Base styles */
.container {
  padding: 20px;
}

/* Tablet - 768px and up */
@media (min-width: 768px) {
  .container {
    padding: 40px;
  }
}

/* Desktop - 1024px and up */
@media (min-width: 1024px) {
  .container {
    padding: 60px 5%;
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### Animation Classes

Common animations used across component stylesheets:
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (for loaders) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 🚧Future Enhancements

### Planned Features
- [ ] Payment Gateway Integration (Stripe/Razorpay)
- [ ] Email Notifications (booking confirmations)
- [ ] SMS Notifications via Twilio
- [ ] Advanced Search Filters
- [ ] Flight Reviews & Ratings
- [ ] Loyalty Program
- [ ] Multi-language Support
- [ ] Dark/Light Theme Toggle
- [ ] PDF Ticket Generation
- [ ] QR Code Boarding Passes

### Technical Improvements
- [ ] JWT Token Authentication
- [ ] Redux for State Management
- [ ] API Rate Limiting
- [ ] Caching with Redis
- [ ] Automated Testing
- [ ] CI/CD Pipeline
- [ ] Docker Containerization

---

## 🤝Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Repository
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow React best practices
- Place styles in appropriate CSS file in `/client/src/styles`
- Use meaningful variable names
- Add comments for complex logic

---

## 👨‍💻Author

**SALADI SUBRAHMANYAM**
- GitHub: [subbu666](https://github.com/subbu666)
- Email: saladisubrahmanyam6@gmail.com

---

## 🙏Acknowledgments

- React documentation and community
- MongoDB Atlas for database hosting
- Bootstrap framework
- Express.js framework
- All open-source contributors

---

## 📞 Support

For support, email saladisubrahmanyam6@gmail.com or open an issue in the GitHub repository.

---

## 🌟Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Node.js, MongoDB, and Bootstrap**

*Last Updated: February 2026*