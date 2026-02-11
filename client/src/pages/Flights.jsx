import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';

const Flights = () => {
  const [userDetails, setUserDetails] = useState();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError } = useContext(GeneralContext);

  useEffect(()=>{
    fetchUserData();
    fetchFlights();
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

  const fetchFlights = async () =>{
    setLoading(true);
    try {
      const response = await api.get('/fetch-flights');
      setFlights(response.data);
    } catch (err) {
      showError('Error', 'Failed to load flights.');
    }
    setLoading(false);
  }

  const operatorFlights = flights.filter(flight => flight.flightName === localStorage.getItem('username'));

  if (!userDetails) {
    return (
      <div className="flights-page">
        <div className="loading-state">
          <div className="spinner-premium"></div>
          <p>Loading...</p>
        </div>
        <style>{flightsStyles}</style>
      </div>
    );
  }

  if (userDetails.approval === 'not-approved') {
    return (
      <div className="flights-page">
        <div className="status-message pending">
          <div className="status-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2>Approval Pending</h2>
          <p>Your application is under review. You'll be able to manage flights once approved.</p>
          <span className="status-badge">Pending Approval</span>
        </div>
        <style>{flightsStyles}</style>
      </div>
    );
  }

  return (
    <div className="flights-page">
      <div className="page-header">
        <div className="header-content">
          <h1>My Flights</h1>
          <p>Manage your flight routes and schedules</p>
        </div>
        <button className="btn-premium" onClick={() => navigate('/new-flight')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Add New Flight
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-premium"></div>
          <p>Loading flights...</p>
        </div>
      ) : operatorFlights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <h3>No Flights Yet</h3>
          <p>You haven't added any flights yet. Start by adding your first route!</p>
          <button className="btn-premium" onClick={() => navigate('/new-flight')}>
            Add Your First Flight
          </button>
        </div>
      ) : (
        <div className="flights-grid">
          {operatorFlights.map((flight) => (
            <div className="flight-card" key={flight._id}>
              <div className="flight-header">
                <div className="airline-info">
                  <div className="airline-logo">{flight.flightName.charAt(0)}</div>
                  <div>
                    <h4>{flight.flightName}</h4>
                    <span>{flight.flightId}</span>
                  </div>
                </div>
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{flight.basePrice}</span>
                  <span className="per">/person</span>
                </div>
              </div>

              <div className="route-info">
                <div className="route-point">
                  <span className="city">{flight.origin}</span>
                  <span className="time">{flight.departureTime}</span>
                </div>
                <div className="route-line">
                  <div className="line"></div>
                  <span className="plane">✈</span>
                </div>
                <div className="route-point">
                  <span className="city">{flight.destination}</span>
                  <span className="time">{flight.arrivalTime}</span>
                </div>
              </div>

              <div className="flight-stats">
                <div className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>{flight.totalSeats} seats</span>
                </div>
                <div className="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Active</span>
                </div>
              </div>

              <div className="flight-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/edit-flight/${flight._id}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Flight
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{flightsStyles}</style>
    </div>
  )
}

const flightsStyles = `
  .flights-page {
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
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .page-header {
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

  .page-header .btn-premium {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #d4af37, #e4c158);
    border: none;
    border-radius: 12px;
    color: #0a0e27;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .page-header .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    min-height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .empty-state h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  .empty-state p {
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .empty-state .btn-premium {
    padding: 12px 24px;
    background: linear-gradient(135deg, #d4af37, #e4c158);
    border: none;
    border-radius: 12px;
    color: #0a0e27;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .empty-state .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  }

  .flights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
  }

  .flight-card {
    background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .flight-card:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .flight-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .airline-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .airline-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #d4af37, #e4c158);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 700;
    color: #0a0e27;
  }

  .airline-info h4 {
    font-size: 1.1rem;
    color: white;
    margin: 0 0 4px;
  }

  .airline-info span {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .price-tag {
    text-align: right;
  }

  .price-tag .currency {
    font-size: 0.9rem;
    color: #d4af37;
  }

  .price-tag .amount {
    font-size: 1.6rem;
    font-weight: 700;
    color: #d4af37;
  }

  .price-tag .per {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .route-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 14px;
    margin-bottom: 16px;
  }

  .route-point {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .route-point .city {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .route-point .time {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .route-line {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    position: relative;
  }

  .route-line .line {
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
  }

  .route-line .plane {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.1rem;
  }

  .flight-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }

  .flight-actions {
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .btn-edit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 10px;
    color: #60a5fa;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-edit:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  @media (max-width: 768px) {
    .flights-page {
      padding: 90px 5% 40px;
    }

    .page-header {
      flex-direction: column;
      gap: 20px;
    }

    .flights-grid {
      grid-template-columns: 1fr;
    }
    
    .header-content h1 {
      font-size: 2rem;
    }
    
    .status-message h2 {
      font-size: 1.5rem;
    }
  }
`;

export default Flights