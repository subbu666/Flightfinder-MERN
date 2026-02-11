import React, { useContext, useEffect, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookFlight = () => {
    const {id} = useParams();

    const [flightName, setFlightName] = useState('');
    const [flightId, setFlightId] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [StartCity, setStartCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [startTime, setStartTime] = useState();
    const [loading, setLoading] = useState(true);
  
    useEffect(()=>{
      fetchFlightData();
    }, [])
  
    const fetchFlightData = async () =>{
      setLoading(true);
      try {
        const response = await api.get(`/fetch-flight/${id}`);
        setFlightName(response.data.flightName);
        setFlightId(response.data.flightId);
        setBasePrice(response.data.basePrice);
        setStartCity(response.data.origin);
        setDestinationCity(response.data.destination);
        setStartTime(response.data.departureTime);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [coachType, setCoachType] = useState('');
    const {ticketBookingDate} = useContext(GeneralContext);
    const [journeyDate, setJourneyDate] = useState(ticketBookingDate);
  
    const [numberOfPassengers, setNumberOfPassengers] = useState(0);
    const [passengerDetails, setPassengerDetails] = useState([]);
  
    const [totalPrice, setTotalPrice] = useState(0);
    const price = {'economy': 1, 'premium-economy': 2, 'business': 3, 'first-class': 4}
    
  
    const handlePassengerChange = (event) => {
      const value = parseInt(event.target.value);
      setNumberOfPassengers(value);
    };
  
    const handlePassengerDetailsChange = (index, key, value) => {
      setPassengerDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[index] = { ...updatedDetails[index], [key]: value };
        return updatedDetails;
      });
    };
  
    useEffect(()=>{
      if(price[coachType] * basePrice * numberOfPassengers){
        setTotalPrice(price[coachType] * basePrice * numberOfPassengers);
      }
    },[numberOfPassengers, coachType, basePrice])
  
  
    const navigate = useNavigate();
    const { showSuccess, showError } = useContext(GeneralContext);
  
    const bookFlight = async ()=>{
      if (!email || !mobile || !coachType || numberOfPassengers === 0) {
        showError('Missing Information', 'Please fill in all required fields.');
        return;
      }

      const inputs = {
        user: localStorage.getItem('userId'), 
        flight: id, 
        flightName, 
        flightId, 
        departure: StartCity, 
        journeyTime: startTime, 
        destination: destinationCity, 
        email, 
        mobile, 
        passengers: passengerDetails, 
        totalPrice, 
        journeyDate, 
        seatClass: coachType
      };
      
      try {
        await api.post('/book-ticket', inputs);
        showSuccess('Booking Confirmed!', 'Your flight has been booked successfully.');
        setTimeout(() => navigate('/bookings'), 1500);
      } catch (err) {
        showError('Booking Failed', 'Unable to complete your booking. Please try again.');
      }
    }

    const coachTypes = [
      { value: 'economy', label: 'Economy Class', multiplier: 1 },
      { value: 'premium-economy', label: 'Premium Economy', multiplier: 2 },
      { value: 'business', label: 'Business Class', multiplier: 3 },
      { value: 'first-class', label: 'First Class', multiplier: 4 }
    ];
  
    if (loading) {
      return (
        <div className="book-flight-page">
          <div className="loading-state">
            <div className="spinner-premium"></div>
            <p>Loading flight details...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className='book-flight-page'>
        <div className="booking-container">
          <div className="flight-summary">
            <div className="summary-header">
              <div className="airline-info">
                <div className="airline-logo">{flightName.charAt(0)}</div>
                <div>
                  <h3>{flightName}</h3>
                  <span>{flightId}</span>
                </div>
              </div>
              <div className="price-display">
                <span className="label">Base Price</span>
                <span className="value">₹{basePrice}</span>
              </div>
            </div>

            <div className="route-display">
              <div className="route-point">
                <span className="city">{StartCity}</span>
                <span className="time">{startTime}</span>
              </div>
              <div className="route-line">
                <div className="line"></div>
                <span className="plane">✈</span>
              </div>
              <div className="route-point">
                <span className="city">{destinationCity}</span>
              </div>
            </div>
          </div>

          <div className="booking-form">
            <h2>Passenger Details</h2>

            <div className="form-section">
              <h4>Contact Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Journey Details</h4>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>Journey Date</label>
                  <input 
                    type="date" 
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Passengers</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={numberOfPassengers}
                    onChange={handlePassengerChange}
                    placeholder="1"
                  />
                </div>
                <div className="form-group">
                  <label>Travel Class</label>
                  <select value={coachType} onChange={(e) => setCoachType(e.target.value)}>
                    <option value="">Select Class</option>
                    {coachTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {numberOfPassengers > 0 && (
              <div className="form-section passengers-section">
                <h4>Passenger Information</h4>
                <div className="passengers-list">
                  {Array.from({ length: numberOfPassengers }).map((_, index) => (
                    <div className="passenger-form" key={index}>
                      <div className="passenger-header">
                        <span className="passenger-number">Passenger {index + 1}</span>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input 
                            type="text"
                            value={passengerDetails[index]?.name || ''}
                            onChange={(e) => handlePassengerDetailsChange(index, 'name', e.target.value)}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="form-group small">
                          <label>Age</label>
                          <input 
                            type="number"
                            min="1"
                            max="120"
                            value={passengerDetails[index]?.age || ''}
                            onChange={(e) => handlePassengerDetailsChange(index, 'age', e.target.value)}
                            placeholder="25"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalPrice > 0 && (
              <div className="price-summary">
                <div className="price-row">
                  <span>Base Price × {numberOfPassengers} passengers</span>
                  <span>₹{basePrice * numberOfPassengers}</span>
                </div>
                <div className="price-row">
                  <span>Class Multiplier ({coachType.replace('-', ' ')})</span>
                  <span>×{price[coachType]}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="total-price">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button className="btn-premium btn-book" onClick={bookFlight}>
              <span>Confirm Booking</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          .book-flight-page {
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

          .booking-container {
            max-width: 800px;
            margin: 0 auto;
          }

          .flight-summary {
            background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 24px;
          }

          .summary-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .airline-info {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .airline-logo {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #d4af37, #e4c158);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            color: #0a0e27;
          }

          .airline-info h3 {
            font-size: 1.3rem;
            color: white;
            margin: 0 0 4px;
          }

          .airline-info span {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .price-display {
            text-align: right;
          }

          .price-display .label {
            display: block;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 4px;
          }

          .price-display .value {
            font-size: 1.8rem;
            font-weight: 700;
            color: #d4af37;
          }

          .route-display {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
          }

          .route-point {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .route-point .city {
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
          }

          .route-point .time {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .route-line {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 30px;
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
            font-size: 1.2rem;
          }

          .booking-form {
            background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 32px;
          }

          .booking-form h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            color: white;
            margin-bottom: 28px;
          }

          .form-section {
            margin-bottom: 28px;
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
          }

          .form-row.three-col {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group.small {
            max-width: 120px;
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

          .form-group select option {
            background: #161b22;
            color: white;
          }

          .passengers-section {
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .passengers-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .passenger-form {
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
          }

          .passenger-header {
            margin-bottom: 16px;
          }

          .passenger-number {
            font-size: 0.9rem;
            font-weight: 600;
            color: #d4af37;
          }

          .price-summary {
            padding: 24px;
            background: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 16px;
            margin-bottom: 24px;
          }

          .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.7);
          }

          .price-row.total {
            margin-top: 16px;
            margin-bottom: 0;
            padding-top: 16px;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
          }

          .price-row.total span:first-child {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
          }

          .total-price {
            font-size: 1.8rem !important;
            font-weight: 700;
            color: #d4af37 !important;
          }

          .price-divider {
            height: 1px;
            background: rgba(212, 175, 55, 0.2);
            margin: 12px 0;
          }

          .btn-book {
            width: 100%;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          @media (max-width: 768px) {
            .form-row,
            .form-row.three-col {
              grid-template-columns: 1fr;
            }

            .form-group.small {
              max-width: none;
            }

            .summary-header {
              flex-direction: column;
              gap: 20px;
              text-align: center;
            }

            .price-display {
              text-align: center;
            }
          }
        `}</style>
      </div>
    )
  }

export default BookFlight