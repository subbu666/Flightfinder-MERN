import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';

const FlightAdmin = () => {

  const navigate = useNavigate();
  const { showError } = useContext(GeneralContext);

  const [userDetails, setUserDetails] = useState();
  const [bookingCount, setBookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetchUserData();
    fetchData();
  }, [])

  const fetchUserData = async () =>{
    try{
      const id = localStorage.getItem('userId');
      const response = await api.get(`/fetch-user/${id}`);
      setUserDetails(response.data);
    }catch(err){
      showError('Error', 'Failed to load user data.');
    }
  } 

  const fetchData = async () =>{
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const [bookingsRes, flightsRes] = await Promise.all([
        api.get('/fetch-bookings'),
        api.get('/fetch-flights')
      ]);
      
      setBookingCount(bookingsRes.data.filter(booking => booking.flightName === username).length);
      setFlightsCount(flightsRes.data.filter(flight => flight.flightName === username).length);
    } catch (err) {
      showError('Error', 'Failed to load dashboard data.');
    }
    setLoading(false);
  }

  const statCards = [
    { 
      title: 'Total Bookings', 
      value: bookingCount, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      color: '#00d4aa',
      path: '/flight-bookings',
      description: 'View all bookings'
    },
    { 
      title: 'My Flights', 
      value: flightsCount, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
          <path d="M22 12l-4-4m4 4l-4 4"/>
        </svg>
      ),
      color: '#3b82f6',
      path: '/flights',
      description: 'Manage flights'
    },
    { 
      title: 'Add New Flight', 
      value: '+', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
      color: '#d4af37',
      path: '/new-flight',
      description: 'Create new route'
    }
  ];

  if (!userDetails) {
    return (
      <div className="flight-admin-page">
        <div className="loading-state">
          <div className="spinner-premium"></div>
          <p>Loading...</p>
        </div>
        <style>{flightAdminStyles}</style>
      </div>
    );
  }

  if (userDetails.approval === 'not-approved') {
    return (
      <div className="flight-admin-page">
        <div className="status-message pending">
          <div className="status-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2>Approval Pending</h2>
          <p>Your application is under review. Our admin team will approve your account shortly.</p>
          <span className="status-badge">Pending Approval</span>
        </div>
        <style>{flightAdminStyles}</style>
      </div>
    );
  }

  if (userDetails.approval === 'rejected') {
    return (
      <div className="flight-admin-page">
        <div className="status-message rejected">
          <div className="status-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Application Rejected</h2>
          <p>Unfortunately, your operator application has been rejected. Please contact support for more information.</p>
          <span className="status-badge">Rejected</span>
        </div>
        <style>{flightAdminStyles}</style>
      </div>
    );
  }

  return (
    <div className="flight-admin-page">
      <div className="admin-header">
        <div className="header-content">
          <h1>Operator Dashboard</h1>
          <p>Welcome back, {userDetails.username}!</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchData} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? 'spinning' : ''}>
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="stat-card"
            onClick={() => navigate(card.path)}
            style={{'--card-color': card.color}}
          >
            <div className="stat-icon" style={{color: card.color}}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
              <span className="description">{card.description}</span>
            </div>
            <div className="stat-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <style>{flightAdminStyles}</style>
    </div>
  )
}

const flightAdminStyles = `
  .flight-admin-page {
    padding: 100px 5% 60px;
    min-height: 100vh;
    background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 180px);
  }

  .spinner-premium {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(212, 175, 55, 0.2);
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .status-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 180px);
    text-align: center;
    padding: 40px 20px;
  }

  .status-message.pending .status-icon {
    color: #f59e0b;
  }

  .status-message.rejected .status-icon {
    color: #dc3545;
  }

  .status-icon {
    margin-bottom: 24px;
  }

  .status-message h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: white;
    margin-bottom: 12px;
  }

  .status-message p {
    color: rgba(255, 255, 255, 0.6);
    max-width: 400px;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .status-badge {
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-message.pending .status-badge {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .status-message.rejected .status-badge {
    background: rgba(220, 53, 69, 0.15);
    color: #ff6b7a;
    border: 1px solid rgba(220, 53, 69, 0.3);
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }

  .header-content h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: white;
    margin-bottom: 8px;
  }

  .header-content p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1rem;
  }

  .btn-refresh {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-refresh:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .btn-refresh:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 28px;
    background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--card-color);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.1);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 14px;
  }

  .stat-info h3 {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin: 0;
  }

  .stat-info p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin: 4px 0 2px;
  }

  .stat-info .description {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.8rem;
  }

  .stat-arrow {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .stat-card:hover .stat-arrow {
    color: var(--card-color);
    transform: translateX(4px);
  }

  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .flight-admin-page {
      padding: 90px 5% 40px;
    }

    .admin-header {
      flex-direction: column;
      gap: 20px;
    }
    
    .header-content h1 {
      font-size: 2rem;
    }
    
    .status-message h2 {
      font-size: 1.5rem;
    }
  }
`;

export default FlightAdmin