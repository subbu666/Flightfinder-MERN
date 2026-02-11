import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';

const EditFlight = () => {
    const [flightName, setFlightName] = useState('');
    const [flightId, setFlightId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [startTime, setStartTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [totalSeats, setTotalSeats] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
    const [loading, setLoading] = useState(true);
  
    const {id} = useParams();
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
      fetchFlightData();
    }, [])
  
    const fetchFlightData = async () =>{
      setLoading(true);
      try {
        const response = await api.get(`/fetch-flight/${id}`);
        const data = response.data;
        setFlightName(data.flightName);
        setFlightId(data.flightId);
        setOrigin(data.origin);
        setDestination(data.destination);
        setTotalSeats(data.totalSeats);
        setBasePrice(data.basePrice);
  
        const timeParts1 = data.departureTime.split(":");
        const startT = new Date();
        startT.setHours(parseInt(timeParts1[0], 10));
        startT.setMinutes(parseInt(timeParts1[1], 10));
        const hours1 = String(startT.getHours()).padStart(2, '0');
        const minutes1 = String(startT.getMinutes()).padStart(2, '0');
        setStartTime(`${hours1}:${minutes1}`);
  
        const timeParts2 = data.arrivalTime.split(":");
        const startD = new Date();
        startD.setHours(parseInt(timeParts2[0], 10));
        startD.setMinutes(parseInt(timeParts2[1], 10));
        const hours2 = String(startD.getHours()).padStart(2, '0');
        const minutes2 = String(startD.getMinutes()).padStart(2, '0');
        setArrivalTime(`${hours2}:${minutes2}`);
      } catch (err) {
        showError('Error', 'Failed to load flight data.');
      }
      setLoading(false);
    }
  
    const handleSubmit = async () =>{
      const inputs = {
        _id: id,
        flightName, 
        flightId, 
        origin, 
        destination, 
        departureTime: startTime, 
        arrivalTime, 
        basePrice, 
        totalSeats
      };
  
      try {
        await api.put('/update-flight', inputs);
        showSuccess('Flight Updated', 'Flight details have been updated successfully.');
        navigate('/flights');
      } catch (err) {
        showError('Update Failed', 'Unable to update flight. Please try again.');
      }
    }

    if (loading) {
      return (
        <div className="edit-flight-page">
          <div className="loading-state">
            <div className="spinner-premium"></div>
            <p>Loading flight details...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className='edit-flight-page'>
        <div className="form-container">
          <div className="form-header">
            <button className="btn-back" onClick={() => navigate('/flights')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Flights
            </button>
            <h1>Edit Flight</h1>
            <p>Update flight details and schedule</p>
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
                    onChange={(e) => setFlightName(e.target.value)}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Flight ID</label>
                  <input 
                    type="text" 
                    value={flightId}
                    onChange={(e) => setFlightId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Route Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Departure City</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Departure Time</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Destination City</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input 
                    type="time" 
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Pricing & Capacity</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Base Price (₹)</label>
                  <input 
                    type="number" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Total Seats</label>
                  <input 
                    type="number" 
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => navigate('/flights')}>
                Cancel
              </button>
              <button className="btn-premium" onClick={handleSubmit}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .edit-flight-page {
            padding: 100px 5% 60px;
            min-height: 100vh;
            background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
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

          .loading-state p {
            color: rgba(255, 255, 255, 0.5);
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
          }

          @media (max-width: 768px) {
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
          }
        `}</style>
      </div>
    )
  }

export default EditFlight