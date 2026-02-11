import React, { useEffect, useState } from 'react'
import api from '../config/axios';

const AllUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(()=>{
    fetchUsers();
  },[]);

  const fetchUsers = async () =>{
    setLoading(true);
    try {
      const response = await api.get('/fetch-users');
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  const customers = users.filter(user => user.usertype === 'customer');
  const operators = users.filter(user => user.usertype === 'flight-operator');
  const admins = users.filter(user => user.usertype === 'admin');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="user-status approved">Approved</span>;
      case 'not-approved':
        return <span className="user-status pending">Pending</span>;
      case 'rejected':
        return <span className="user-status rejected">Rejected</span>;
      default:
        return <span className="user-status">{status || 'Active'}</span>;
    }
  };

  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="user-avatar">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="user-info">
        <h4>{user.username}</h4>
        <p>{user.email}</p>
        {user.usertype === 'flight-operator' && getStatusBadge(user.approval)}
      </div>
      <div className="user-id">
        <span>ID: {user._id.slice(-8).toUpperCase()}</span>
      </div>
    </div>
  );

  return (
    <div className="all-users-page">
      <div className="page-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>View and manage all registered users</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Customers
          <span className="tab-count">{customers.length}</span>
        </button>
        <button 
          className={`tab ${activeTab === 'operators' ? 'active' : ''}`}
          onClick={() => setActiveTab('operators')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
            <path d="M22 12l-4-4m4 4l-4 4"/>
          </svg>
          Operators
          <span className="tab-count">{operators.length}</span>
        </button>
        <button 
          className={`tab ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Admins
          <span className="tab-count">{admins.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-premium"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-content">
          {activeTab === 'customers' && (
            <>
              {customers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No Customers</h3>
                  <p>No customer accounts found in the system</p>
                </div>
              ) : (
                <div className="users-grid">
                  {customers.map(user => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'operators' && (
            <>
              {operators.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✈️</div>
                  <h3>No Operators</h3>
                  <p>No flight operators registered yet</p>
                </div>
              ) : (
                <div className="users-grid">
                  {operators.map(user => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'admins' && (
            <>
              {admins.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⚙️</div>
                  <h3>No Admins</h3>
                  <p>No administrator accounts found</p>
                </div>
              ) : (
                <div className="users-grid">
                  {admins.map(user => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .all-users-page {
          padding: 100px 5% 60px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
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

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          width: fit-content;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab.active {
          background: linear-gradient(135deg, #d4af37, #e4c158);
          color: #0a0e27;
        }

        .tab-count {
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          font-size: 0.75rem;
        }

        .tab.active .tab-count {
          background: rgba(10, 14, 39, 0.2);
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

        .users-content {
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          padding: 80px;
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
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .user-card:hover {
          transform: translateY(-2px);
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .user-avatar {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-radius: 14px;
          font-size: 1.3rem;
          font-weight: 700;
          color: #0a0e27;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-info h4 {
          font-size: 1rem;
          color: white;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-info p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-status {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-status.approved {
          background: rgba(0, 212, 170, 0.15);
          color: #00d4aa;
          border: 1px solid rgba(0, 212, 170, 0.3);
        }

        .user-status.pending {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .user-status.rejected {
          background: rgba(220, 53, 69, 0.15);
          color: #ff6b7a;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .user-id {
          flex-shrink: 0;
        }

        .user-id span {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }

          .tabs-container {
            width: 100%;
            overflow-x: auto;
          }

          .tab {
            white-space: nowrap;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default AllUsers