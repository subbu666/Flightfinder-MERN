import api from '../config/axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AllFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    const fetchFlights = async () =>{
      setLoading(true);
      try {
        const response = await api.get('/fetch-flights');
        setFlights(response.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
      
    useEffect(()=>{
      fetchFlights();
    }, [])
      
    return (
      <div className="all-flights-page">
        <div className="page-header">
          <div className="header-content">
            <h1>All Flights</h1>
            <p>Complete list of available flights in the system</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{flights.length}</span>
              <span className="stat-label">Total Flights</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-premium"></div>
            <p>Loading flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
                <path d="M22 12l-4-4m4 4l-4 4"/>
              </svg>
            </div>
            <h3>No Flights Found</h3>
            <p>There are no flights in the system yet</p>
          </div>
        ) : (
          <div className="flights-table-container">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Schedule</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight._id}>
                    <td>
                      <div className="flight-cell">
                        <div className="flight-logo">{flight.flightName.charAt(0)}</div>
                        <div>
                          <span className="flight-name">{flight.flightName}</span>
                          <span className="flight-id">{flight.flightId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="route-cell">
                        <span className="origin">{flight.origin}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                        <span className="destination">{flight.destination}</span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-cell">
                        <span className="time">{flight.departureTime}</span>
                        <span className="separator">-</span>
                        <span className="time">{flight.arrivalTime}</span>
                      </div>
                    </td>
                    <td>
                      <span className="price">₹{flight.basePrice.toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="seats-cell">
                        <span className="seats-count">{flight.totalSeats}</span>
                        <span className="seats-label">available</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <style>{`
          .all-flights-page {
            padding: 100px 5% 60px;
            min-height: 100vh;
            background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
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

          .header-stats {
            padding: 16px 24px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
          }

          .stat-value {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: #d4af37;
          }

          .stat-label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px;
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

          .empty-state {
            text-align: center;
            padding: 80px;
          }

          .empty-icon {
            color: rgba(255, 255, 255, 0.2);
            margin-bottom: 24px;
          }

          .empty-state h3 {
            color: white;
            font-size: 1.5rem;
            margin-bottom: 8px;
          }

          .empty-state p {
            color: rgba(255, 255, 255, 0.5);
          }

          .flights-table-container {
            background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            overflow: hidden;
          }

          .flights-table {
            width: 100%;
            border-collapse: collapse;
          }

          .flights-table thead {
            background: rgba(255, 255, 255, 0.03);
          }

          .flights-table th {
            padding: 20px 24px;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .flights-table td {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          }

          .flights-table tbody tr {
            transition: all 0.3s ease;
          }

          .flights-table tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
          }

          .flights-table tbody tr:last-child td {
            border-bottom: none;
          }

          .flight-cell {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .flight-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #d4af37, #e4c158);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: 700;
            color: #0a0e27;
          }

          .flight-name {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: white;
          }

          .flight-id {
            display: block;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .route-cell {
            display: flex;
            align-items: center;
            gap: 10px;
            color: rgba(255, 255, 255, 0.7);
          }

          .route-cell .origin,
          .route-cell .destination {
            font-weight: 500;
            color: white;
          }

          .schedule-cell {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .schedule-cell .time {
            font-size: 0.95rem;
            color: white;
          }

          .schedule-cell .separator {
            color: rgba(255, 255, 255, 0.3);
          }

          .price {
            font-size: 1rem;
            font-weight: 600;
            color: #d4af37;
          }

          .seats-cell {
            display: flex;
            flex-direction: column;
          }

          .seats-count {
            font-size: 1rem;
            font-weight: 600;
            color: white;
          }

          .seats-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
          }

          .status-badge {
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .status-badge.active {
            background: rgba(0, 212, 170, 0.15);
            color: #00d4aa;
            border: 1px solid rgba(0, 212, 170, 0.3);
          }

          @media (max-width: 1024px) {
            .flights-table-container {
              overflow-x: auto;
            }

            .flights-table {
              min-width: 900px;
            }
          }

          @media (max-width: 768px) {
            .page-header {
              flex-direction: column;
              gap: 20px;
            }
          }
        `}</style>
      </div>
    )
  }

export default AllFlights