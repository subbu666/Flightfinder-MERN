import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const PremiumModal = () => {
  const { modal, hideModal } = useContext(GeneralContext);

  if (!modal.show) return null;

  const getIcon = () => {
    switch (modal.type) {
      case 'success':
        return (
          <div className="modal-icon success">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(0, 212, 170, 0.2)"/>
              <path d="M16 24L21 29L32 18" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="modal-icon error">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(220, 53, 69, 0.2)"/>
              <path d="M18 18L30 30M30 18L18 30" stroke="#dc3545" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="modal-icon warning">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(245, 158, 11, 0.2)"/>
              <path d="M24 16V26M24 32V32.01" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="modal-icon info">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(59, 130, 246, 0.2)"/>
              <path d="M24 20V20.01M24 16V26M24 32V32.01" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        );
    }
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    hideModal();
  };

  return (
    <>
      <div className="premium-modal-overlay" onClick={hideModal}>
        <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
          <div className={`premium-modal-header ${modal.type}`}>
            <button className="modal-close-btn" onClick={hideModal}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="premium-modal-body">
            {getIcon()}
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
          </div>
          <div className="premium-modal-footer">
            {modal.showCancel && (
              <button className="btn-premium btn-premium-outline" onClick={hideModal}>
                Cancel
              </button>
            )}
            <button 
              className={`btn-premium ${modal.type === 'error' ? 'btn-premium-danger' : modal.type === 'success' ? 'btn-premium-success' : ''}`} 
              onClick={handleConfirm}
            >
              {modal.showCancel ? 'Confirm' : 'OK'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .premium-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 14, 39, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
          padding: 20px;
        }

        .premium-modal {
          background: linear-gradient(145deg, #161b22 0%, #0d1117 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .premium-modal-header {
          position: relative;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-modal-header.success {
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(0, 170, 136, 0.1) 100%);
        }

        .premium-modal-header.error {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(200, 35, 51, 0.1) 100%);
        }

        .premium-modal-header.warning {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%);
        }

        .premium-modal-header.info {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: rotate(90deg);
        }

        .premium-modal-body {
          padding: 32px;
          text-align: center;
        }

        .modal-icon {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }

        .modal-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        .premium-modal-footer {
          padding: 20px 32px 32px;
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .premium-modal-footer .btn-premium {
          min-width: 120px;
        }

        @media (max-width: 480px) {
          .premium-modal {
            max-width: 100%;
          }
          
          .premium-modal-body {
            padding: 24px;
          }
          
          .modal-title {
            font-size: 1.5rem;
          }
          
          .premium-modal-footer {
            padding: 16px 24px 24px;
            flex-direction: column;
          }
          
          .premium-modal-footer .btn-premium {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default PremiumModal;