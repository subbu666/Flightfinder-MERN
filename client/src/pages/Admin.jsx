import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/axios'

const Admin = () => {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(()=>{
    fetchData();
  }, [])

  const fetchData = async () =>{
    setLoading(true);
    try {
      const [usersRes, bookingsRes, flightsRes] = await Promise.all([
        api.get('/fetch-users'),
        api.get('/fetch-bookings'),
        api.get('/fetch-flights')
      ]);
      
      setUserCount(usersRes.data.length);
      setUsers(usersRes.data.filter(user => user.approval === 'not-approved'));
      setBookingCount(bookingsRes.data.length);
      setFlightsCount(flightsRes.data.length);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  const handleApproveClick = (user) => {
    setSelectedUser(user);
    setShowApproveModal(true);
  };

  const handleRejectClick = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const approveRequest = async () =>{
    if (!selectedUser) return;
    try {
      await api.post('/approve-operator', {id: selectedUser._id});
      setShowApproveModal(false);
      setSelectedUser(null);
      fetchData();
    } catch(err) {
      console.log(err);
    }
  }

  const rejectRequest = async () =>{
    if (!selectedUser) return;
    try {
      await api.post('/reject-operator', {id: selectedUser._id});
      setShowRejectModal(false);
      setSelectedUser(null);
      fetchData();
    } catch(err) {
      console.log(err);
    }
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: userCount, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: '#d4af37',
      path: '/all-users'
    },
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
      path: '/all-bookings'
    },
    { 
      title: 'Active Flights', 
      value: flightsCount, 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
          <path d="M22 12l-4-4m4 4l-4 4"/>
        </svg>
      ),
      color: '#3b82f6',
      path: '/all-flights'
    }
  ];

  return (
    <div className="admin-page">
      {/* ... rest of JSX remains exactly the same ... */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
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

      <div className="requests-section">
        <div className="section-header">
          <div>
            <h2>Operator Applications</h2>
            <p>Pending approval requests from flight operators</p>
          </div>
          <span className="badge-count">{users.length} pending</span>
        </div>

        <div className="requests-list">
          {users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>No Pending Requests</h3>
              <p>All operator applications have been processed</p>
            </div>
          ) : (
            users.map((user) => (
              <div className="request-card" key={user._id}>
                <div className="request-info">
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <span className="user-type">Flight Operator</span>
                  </div>
                </div>
                <div className="request-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApproveClick(user)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleRejectClick(user)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal-content approve" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(0, 212, 170, 0.2)"/>
                <path d="M16 24l6 6 12-12" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Approve Operator</h3>
            <p>Are you sure you want to approve <strong>{selectedUser?.username}</strong> as a flight operator?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button className="btn-success" onClick={approveRequest}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content reject" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(220, 53, 69, 0.2)"/>
                <path d="M18 18l12 12M30 18L18 30" stroke="#dc3545" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Reject Application</h3>
            <p>Are you sure you want to reject <strong>{selectedUser?.username}</strong>'s application?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={rejectRequest}>Reject</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-page {
          padding: 100px 5% 60px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 48px;
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
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin: 0;
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

        .requests-section {
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: white;
          margin: 0;
        }

        .section-header p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin: 4px 0 0;
        }

        .badge-count {
          padding: 6px 14px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 100px;
          font-size: 0.85rem;
          color: #d4af37;
          font-weight: 500;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .request-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          transition: all 0.3s ease;
        }

        .request-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .request-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0a0e27;
        }

        .user-details h4 {
          font-size: 1rem;
          color: white;
          margin: 0 0 4px;
        }

        .user-details p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin: 0 0 6px;
        }

        .user-type {
          display: inline-block;
          padding: 2px 10px;
          background: rgba(0, 212, 170, 0.15);
          border: 1px solid rgba(0, 212, 170, 0.3);
          border-radius: 100px;
          font-size: 0.7rem;
          color: #00d4aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .request-actions {
          display: flex;
          gap: 10px;
        }

        .btn-approve, .btn-reject {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-approve {
          background: rgba(0, 212, 170, 0.15);
          color: #00d4aa;
          border: 1px solid rgba(0, 212, 170, 0.3);
        }

        .btn-approve:hover {
          background: #00d4aa;
          color: #0a0e27;
        }

        .btn-reject {
          background: rgba(220, 53, 69, 0.15);
          color: #ff6b7a;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .btn-reject:hover {
          background: #dc3545;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
        }

        .empty-icon {
          color: rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
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
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: modalSlideIn 0.4s ease;
        }

        .modal-content.approve {
          border-color: rgba(0, 212, 170, 0.3);
        }

        .modal-content.reject {
          border-color: rgba(220, 53, 69, 0.3);
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
          margin-bottom: 28px;
        }

        .modal-content p strong {
          color: white;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-secondary, .btn-success, .btn-danger {
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

        .btn-success {
          background: #00d4aa;
          color: #0a0e27;
        }

        .btn-success:hover {
          background: #33ddb8;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #e04b5a;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 20px;
          }

          .request-card {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .request-info {
            flex-direction: column;
          }

          .request-actions {
            width: 100%;
          }

          .btn-approve, .btn-reject {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Admin