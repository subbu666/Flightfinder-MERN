import React from 'react'

const FlightRequests = () => {
  return (
    <div className="flight-requests-page">
      <div className="page-header">
        <h1>Flight Requests</h1>
        <p>Manage special flight requests</p>
      </div>
      <div className="empty-state">
        <div className="empty-icon">📨</div>
        <h3>No Requests</h3>
        <p>There are no special flight requests at the moment</p>
      </div>

      <style>{`
        .flight-requests-page {
          padding: 100px 5% 60px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
        }

        .page-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: white;
          margin-bottom: 8px;
        }

        .page-header p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          margin-bottom: 40px;
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
      `}</style>
    </div>
  )
}

export default FlightRequests