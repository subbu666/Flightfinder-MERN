import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';

const NewFlight = () => {

    const [userDetails, setUserDetails] = useState();
    const [flightName, setFlightName] = useState(localStorage.getItem('username'));
    const [flightId, setFlightId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [journeyDate, setJourneyDate] = useState(''); // ✅ FIX 1: Added journeyDate state
    const [startTime, setStartTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [totalSeats, setTotalSeats] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(GeneralContext);

    const cities = [
      { value: 'Chennai', label: 'Chennai' },
      { value: 'Bangalore', label: 'Bangalore' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Indore', label: 'Indore' },
      { value: 'Delhi', label: 'Delhi' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Trivendrum', label: 'Trivandrum' },
      { value: 'Bhopal', label: 'Bhopal' },
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'varanasi', label: 'Varanasi' },
      { value: 'Jaipur', label: 'Jaipur' }
    ];
  
    useEffect(()=>{
      fetchUserData();
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
  
    const handleSubmit = async () =>{
      // ✅ FIX 3: Updated validation to include journeyDate
      if (!flightId || !origin || !destination || !journeyDate || !startTime || !arrivalTime || !totalSeats || !basePrice) {
        showError('Missing Information', 'Please fill in all required fields.');
        return;
      }

      if (origin === destination) {
        showError('Invalid Route', 'Origin and destination cannot be the same.');
        return;
      }

      setLoading(true);
      // ✅ FIX 4: Added journeyDate to inputs object
      const inputs = {
        flightName, 
        flightId, 
        origin, 
        destination, 
        journeyDate, // ✅ ADD THIS
        departureTime: startTime, 
        arrivalTime, 
        basePrice: parseInt(basePrice), 
        totalSeats: parseInt(totalSeats)
      };
  
      try {
        // ✅ FIX 5: Endpoint already correct as 'add-flight'
        await api.post('/add-flight', inputs);
        showSuccess('Flight Added', 'Your new flight route has been added successfully.');
        navigate('/flights');
      } catch (err) {
        showError('Error', 'Failed to add flight. Please try again.');
      }
      setLoading(false);
    }
  
    if (!userDetails) {
      return (
        <div className="new-flight-page">
          <div className="loading-state">
            <div className="spinner-premium"></div>
            <p>Loading...</p>
          </div>
          <style>{newFlightStyles}</style>
        </div>
      );
    }

    if (userDetails.approval === 'not-approved') {
      return (
        <div className="new-flight-page">
          <div className="status-message pending">
            <div className="status-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2>Approval Pending</h2>
            <p>Your application is under review. You'll be able to add flights once approved.</p>
            <span className="status-badge">Pending Approval</span>
          </div>
          <style>{newFlightStyles}</style>
        </div>
      );
    }
  
    return (
      <div className='new-flight-page'>
        <div className="form-container">
          <div className="form-header">
            <button className="btn-back" onClick={() => navigate('/flights')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Flights
            </button>
            <h1>Add New Flight</h1>
            <p>Create a new flight route for your airline</p>
          </div>

          <div className="flight-form">
            <div className="form-section">
              <h4>Flight Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Flight Name</label>
                  <input 
                    type="text" 
                    value={flightName}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Flight ID *</label>
                  <input 
                    type="text" 
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                    placeholder="e.g., FL001"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Route Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Departure City *</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Departure Time *</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Destination City *</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Arrival Time *</label>
                  <input 
                    type="time" 
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                  />
                </div>
              </div>
              {/* ✅ FIX 2: Added Journey Date input field */}
              <div className="form-row">
                <div className="form-group">
                  <label>Journey Date *</label>
                  <input 
                    type="date" 
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Pricing & Capacity</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Base Price (₹) *</label>
                  <input 
                    type="number" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="5000"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Total Seats *</label>
                  <input 
                    type="number" 
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="180"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => navigate('/flights')}>
                Cancel
              </button>
              <button 
                className="btn-premium" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Add Flight
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <style>{newFlightStyles}</style>
      </div>
    )
  }

const newFlightStyles = `
  .new-flight-page {
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

  .form-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .form-header {
    margin-bottom: 32px;
  }

  .btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
  }

  .btn-back:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .form-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: white;
    margin-bottom: 8px;
  }

  .form-header p {
    color: rgba(255, 255, 255, 0.5);
  }

  .flight-form {
    background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 32px;
  }

  .form-section {
    margin-bottom: 32px;
  }

  .form-section:last-of-type {
    margin-bottom: 0;
  }

  .form-section h4 {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .form-row:last-child {
    margin-bottom: 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .form-group input,
  .form-group select {
    height: 52px;
    padding: 0 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #d4af37;
    background: rgba(255, 255, 255, 0.08);
  }

  .form-group input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .form-group input:disabled {
    background: rgba(255, 255, 255, 0.02);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
  }

  .form-group select option {
    background: #161b22;
    color: white;
  }

  .form-actions {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .form-actions .btn-secondary {
    flex: 1;
    height: 52px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .form-actions .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .form-actions .btn-premium {
    flex: 2;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: linear-gradient(135deg, #d4af37, #e4c158);
    border: none;
    border-radius: 12px;
    color: #0a0e27;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .form-actions .btn-premium:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  }

  .form-actions .btn-premium:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner-small {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(10, 14, 39, 0.3);
    border-top-color: #0a0e27;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @media (max-width: 768px) {
    .new-flight-page {
      padding: 90px 5% 40px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions .btn-secondary,
    .form-actions .btn-premium {
      flex: none;
    }

    .status-message h2 {
      font-size: 1.5rem;
    }
  }
`;

export default NewFlight