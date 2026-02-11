import React, { useEffect, useState, useContext } from 'react'
import api from '../config/axios';
import { GeneralContext } from '../context/GeneralContext';

const Bookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { showSuccess, showError } = useContext(GeneralContext);

  const userId = localStorage.getItem('userId');

  useEffect(()=>{
    fetchBookings();
  }, [])

  const fetchBookings = async () =>{
    setLoading(true);
    try {
      const response = await api.get('/fetch-bookings');
      setBookings(response.data.reverse());
    } catch (err) {
      showError('Error', 'Failed to load your bookings.');
    }
    setLoading(false);
  }

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const cancelTicket = async () =>{
    if (!selectedBooking) return;
    try {
      await api.put(`/cancel-ticket/${selectedBooking._id}`);
      setShowCancelModal(false);
      setSelectedBooking(null);
      showSuccess('Booking Cancelled', 'Your booking has been cancelled successfully.');
      fetchBookings();
    } catch (err) {
      showError('Error', 'Failed to cancel booking. Please try again.');
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="status-badge confirmed">Confirmed</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">Cancelled</span>;
      default:
        return <span className="status-badge pending">{status}</span>;
    }
  };

  const userBookings = bookings.filter(booking => booking.user === userId);

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="header-content">
          <h1>My Bookings</h1>
          <p>View and manage your flight reservations</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{userBookings.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userBookings.filter(b => b.bookingStatus === 'confirmed').length}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-premium"></div>
          <p>Loading your bookings...</p>
        </div>
      ) : userBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3>No Bookings Yet</h3>
          <p>You haven't booked any flights yet. Start your journey today!</p>
          <button className="btn-premium btn-explore" onClick={() => window.location.href = '/'}>
            Explore Flights
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {userBookings.map((booking) => (
            <div className={`booking-card ${booking.bookingStatus}`} key={booking._id}>
              <div className="booking-header">
                <div className="booking-id">
                  <span className="label">Booking ID</span>
                  <span className="value">#{booking._id.slice(-8).toUpperCase()}</span>
                </div>
                {getStatusBadge(booking.bookingStatus)}
              </div>

              <div className="flight-info">
                <div className="airline">
                  <div className="airline-logo">{booking.flightName.charAt(0)}</div>
                  <div>
                    <h4>{booking.flightName}</h4>
                    <span>{booking.flightId}</span>
                  </div>
                </div>
              </div>

              <div className="route-info">
                <div className="route-point">
                  <span className="city">{booking.departure}</span>
                  <span className="time">{booking.journeyTime}</span>
                </div>
                <div className="route-line">
                  <div className="line"></div>
                  <span className="plane">✈</span>
                </div>
                <div className="route-point">
                  <span className="city">{booking.destination}</span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Journey Date</span>
                    <span className="value">{new Date(booking.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Passengers</span>
                    <span className="value">{booking.passengers.length} {booking.passengers.length === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Booked On</span>
                    <span className="value">{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Price</span>
                    <span className="value price">₹{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {booking.passengers.length > 0 && (
                <div className="passengers-section">
                  <h5>Passenger Details</h5>
                  <div className="passengers-list">
                    {booking.passengers.map((passenger, i) => (
                      <div className="passenger-tag" key={i}>
                        <span className="name">{passenger.name}</span>
                        <span className="age">{passenger.age} yrs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {booking.bookingStatus === 'confirmed' && (
                <div className="booking-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => handleCancelClick(booking)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon warning">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(245, 158, 11, 0.2)"/>
                <path d="M24 16v12M24 32v0.01" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel booking <strong>#{selectedBooking?._id.slice(-8).toUpperCase()}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCancelModal(false)}>Keep Booking</button>
              <button className="btn-danger" onClick={cancelTicket}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bookings-page {
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
          display: flex;
          gap: 24px;
        }

        .stat-item {
          text-align: center;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .stat-value {
          display: block;
          font-size: 1.8rem;
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
          margin-bottom: 24px;
        }

        .btn-explore {
          padding: 14px 32px;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 24px;
        }

        .booking-card {
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .booking-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .booking-card.cancelled {
          opacity: 0.7;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .booking-id {
          display: flex;
          flex-direction: column;
        }

        .booking-id .label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .booking-id .value {
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.confirmed {
          background: rgba(0, 212, 170, 0.15);
          color: #00d4aa;
          border: 1px solid rgba(0, 212, 170, 0.3);
        }

        .status-badge.cancelled {
          background: rgba(220, 53, 69, 0.15);
          color: #ff6b7a;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .flight-info {
          margin-bottom: 16px;
        }

        .airline {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .airline-logo {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0a0e27;
        }

        .airline h4 {
          font-size: 1.1rem;
          color: white;
          margin: 0;
        }

        .airline span {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .route-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 20px;
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
          font-size: 1rem;
        }

        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item .label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-item .value {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .detail-item .value.price {
          color: #d4af37;
          font-weight: 600;
        }

        .passengers-section {
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .passengers-section h5 {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .passengers-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .passenger-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .passenger-tag .name {
          font-size: 0.85rem;
          color: white;
        }

        .passenger-tag .age {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .booking-actions {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-cancel {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          color: #ff6b7a;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: rgba(220, 53, 69, 0.2);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 39, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: linear-gradient(145deg, #161b22 0%, #0d1117 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: modalSlideIn 0.4s ease;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-icon {
          margin-bottom: 20px;
        }

        .modal-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 12px;
        }

        .modal-content p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .modal-content p strong {
          color: white;
        }

        .warning-text {
          color: #f59e0b !important;
          font-size: 0.9rem;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .btn-secondary, .btn-danger {
          padding: 12px 28px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #e04b5a;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }

          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .detail-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Bookings