import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const usertype = localStorage.getItem('userType');
    const { logout } = useContext(GeneralContext);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showCreatorModal, setShowCreatorModal] = useState(false);

    // Add your photo URL here
    const creatorPhotoUrl = process.env.REACT_APP_CREATOR_PHOTO_URL; // Replace with your actual photo URL

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;
    const isLandingPage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    const navLink = (path, label, icon) => (
        <button 
            key={path}
            className={`nav-link ${isActive(path) ? 'active' : ''}`}
            onClick={() => { navigate(path); setMobileMenuOpen(false); }}
        >
            {icon && <span className="nav-icon">{icon}</span>}
            <span className="nav-label">{label}</span>
        </button>
    );

    const CreatorModal = () => (
        <div className="creator-modal-overlay" onClick={() => setShowCreatorModal(false)}>
            <div className="creator-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="creator-modal-close" onClick={() => setShowCreatorModal(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="creator-modal-content">
                    <div className="creator-header">
                        <div className="creator-avatar-wrapper">
                            <div className="creator-avatar">
                                <img src={creatorPhotoUrl} alt="Creator" className="avatar-photo" />
                                <div className="avatar-ring"></div>
                            </div>
                            <div className="creator-status">
                                <span className="status-dot"></span>
                                <span className="status-text">Available for Projects</span>
                            </div>
                        </div>
                        
                        <div className="creator-intro">
                            <h2 className="creator-name">Creator</h2>
                            <p className="creator-title">AI-Driven Full Stack Developer</p>
                        </div>
                    </div>

                    <div className="creator-summary">
                        <div className="summary-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <p className="summary-text">
                            AI-Driven Full Stack Developer skilled in building intelligent web applications by integrating advanced LLMs and modern cloud services. Experienced in transforming ideas into production-ready solutions using collaborative AI workflows (ChatGPT, Gemini, Claude, Grok). Passionate about scalable backend systems, intuitive interfaces, and applied AI innovation.
                        </p>
                    </div>

                    <div className="creator-socials">
                        <h3 className="socials-title">Connect With Me</h3>
                        <div className="socials-grid">
                            <a href="https://github.com/subbu666" target="_blank" rel="noopener noreferrer" className="social-link github">
                                <div className="social-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </div>
                                <div className="social-info">
                                    <span className="social-label">GitHub</span>
                                    <span className="social-handle">@subbu666</span>
                                </div>
                            </a>

                            <a href="https://www.linkedin.com/in/saladi-subrahmanyam-4376a4311" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                                <div className="social-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </div>
                                <div className="social-info">
                                    <span className="social-label">LinkedIn</span>
                                    <span className="social-handle">@saladi-subrahmanyam</span>
                                </div>
                            </a>

                            <a href="mailto:saladisubrahmanyam6@gmail.com" className="social-link email">
                                <div className="social-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <div className="social-info">
                                    <span className="social-label">Email</span>
                                    <span className="social-handle">saladisubrahmanyam6@gmail.com</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="creator-footer">
                        <div className="footer-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            <span>Open to Collaborate</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const getNavContent = () => {
        if (!usertype) {
            return (
                <>
                    <div className="nav-brand" onClick={() => navigate('/')}>
                        <div className="brand-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">SB Flights</span>
                            <span className="brand-tagline">Premium Travel</span>
                        </div>
                    </div>
                    <div className={`nav-options ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        {navLink('/', 'Home', 
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        )}
                        {isLandingPage && (
                            <button className="nav-link creator-btn" onClick={() => { setShowCreatorModal(true); setMobileMenuOpen(false); }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <span className="nav-label">Creator</span>
                            </button>
                        )}
                        {navLink('/auth', 'Login',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                <polyline points="10 17 15 12 10 7"/>
                                <line x1="15" y1="12" x2="3" y2="12"/>
                            </svg>
                        )}
                    </div>
                </>
            );
        }

        if (usertype === 'customer') {
            return (
                <>
                    <div className="nav-brand" onClick={() => navigate('/')}>
                        <div className="brand-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">SB Flights</span>
                            <span className="brand-tagline">Premium Travel</span>
                        </div>
                    </div>
                    <div className={`nav-options ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        {navLink('/', 'Home',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        )}
                        {navLink('/bookings', 'My Bookings',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        )}
                        <button className="nav-link logout" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span className="nav-label">Logout</span>
                        </button>
                    </div>
                </>
            );
        }

        if (usertype === 'admin') {
            return (
                <>
                    <div className="nav-brand admin" onClick={() => navigate('/admin')}>
                        <div className="brand-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">SB Flights</span>
                            <span className="brand-tagline">Admin Portal</span>
                        </div>
                    </div>
                    <div className={`nav-options ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        {navLink('/admin', 'Dashboard',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                            </svg>
                        )}
                        {navLink('/all-users', 'Users',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        )}
                        {navLink('/all-bookings', 'Bookings',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        )}
                        {navLink('/all-flights', 'Flights',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
                                <path d="M22 12l-4-4m4 4l-4 4"/>
                            </svg>
                        )}
                        <button className="nav-link logout" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span className="nav-label">Logout</span>
                        </button>
                    </div>
                </>
            );
        }

        if (usertype === 'flight-operator') {
            return (
                <>
                    <div className="nav-brand operator" onClick={() => navigate('/flight-admin')}>
                        <div className="brand-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">SB Flights</span>
                            <span className="brand-tagline">Operator Portal</span>
                        </div>
                    </div>
                    <div className={`nav-options ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        {navLink('/flight-admin', 'Dashboard',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                            </svg>
                        )}
                        {navLink('/flight-bookings', 'Bookings',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        )}
                        {navLink('/flights', 'My Flights',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12h20M2 12l4-4m-4 4l4 4"/>
                                <path d="M22 12l-4-4m4 4l-4 4"/>
                            </svg>
                        )}
                        {navLink('/new-flight', 'Add Flight',
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="16"/>
                                <line x1="8" y1="12" x2="16" y2="12"/>
                            </svg>
                        )}
                        <button className="nav-link logout" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span className="nav-label">Logout</span>
                        </button>
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <>
            <nav className={`premium-navbar ${scrolled ? 'scrolled' : ''}`}>
                {getNavContent()}
                <button 
                    className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            {showCreatorModal && <CreatorModal />}

            <style>{`
                .premium-navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 80px;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 4%;
                    background: transparent;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .premium-navbar.scrolled {
                    height: 70px;
                    background: rgba(10, 14, 39, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .nav-brand:hover {
                    transform: scale(1.02);
                }

                .brand-logo {
                    color: #d4af37;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .nav-brand.admin .brand-logo {
                    color: #00d4aa;
                }

                .nav-brand.operator .brand-logo {
                    color: #f59e0b;
                }

                .brand-text {
                    display: flex;
                    flex-direction: column;
                }

                .brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: white;
                    line-height: 1.2;
                }

                .brand-tagline {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }

                .nav-options {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 18px;
                    border-radius: 12px;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .nav-link:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.08);
                }

                .nav-link.active {
                    color: #d4af37;
                    background: rgba(212, 175, 55, 0.1);
                }

                .nav-link.creator-btn {
                    position: relative;
                    overflow: hidden;
                }

                .nav-link.creator-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(228, 193, 88, 0.15));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .nav-link.creator-btn:hover::before {
                    opacity: 1;
                }

                .nav-link.creator-btn:hover {
                    color: #d4af37;
                    border-color: rgba(212, 175, 55, 0.3);
                }

                .nav-link.logout {
                    color: rgba(255, 107, 107, 0.8);
                }

                .nav-link.logout:hover {
                    color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.1);
                }

                .nav-icon {
                    display: flex;
                    align-items: center;
                }

                .mobile-menu-btn {
                    display: none;
                    flex-direction: column;
                    gap: 5px;
                    padding: 8px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                }

                .mobile-menu-btn span {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background: white;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }

                .mobile-menu-btn.open span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                .mobile-menu-btn.open span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu-btn.open span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }

                /* Creator Modal Styles */
                .creator-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(10, 14, 39, 0.95);
                    backdrop-filter: blur(16px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                    animation: creatorOverlayFadeIn 0.3s ease;
                }

                @keyframes creatorOverlayFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .creator-modal-container {
                    position: relative;
                    width: 100%;
                    max-width: 680px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background: linear-gradient(145deg, rgba(22, 27, 34, 0.98) 0%, rgba(13, 17, 23, 0.98) 100%);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-radius: 28px;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 175, 55, 0.15);
                    animation: creatorModalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes creatorModalSlideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(40px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .creator-modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: rgba(255, 255, 255, 0.6);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 1;
                }

                .creator-modal-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    transform: rotate(90deg);
                }

                .creator-modal-content {
                    padding: 50px 40px 40px;
                }

                .creator-header {
                    text-align: center;
                    margin-bottom: 36px;
                }

                .creator-avatar-wrapper {
                    margin-bottom: 24px;
                    animation: creatorAvatarPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
                }

                @keyframes creatorAvatarPop {
                    from { opacity: 0; transform: scale(0); }
                    to { opacity: 1; transform: scale(1); }
                }

                .creator-avatar {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 16px;
                }

                .avatar-photo {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    box-shadow: 0 8px 32px rgba(212, 175, 55, 0.4);
                    border: 3px solid rgba(212, 175, 55, 0.3);
                }

                .avatar-ring {
                    position: absolute;
                    inset: -8px;
                    border: 2px solid rgba(212, 175, 55, 0.3);
                    border-radius: 50%;
                    animation: creatorRingPulse 2s ease-out infinite;
                }

                @keyframes creatorRingPulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.2);
                        opacity: 0;
                    }
                }

                .creator-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(0, 212, 170, 0.15);
                    border: 1px solid rgba(0, 212, 170, 0.3);
                    border-radius: 100px;
                    font-size: 0.85rem;
                    color: #00d4aa;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #00d4aa;
                    border-radius: 50%;
                    animation: statusPulse 2s infinite;
                }

                @keyframes statusPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .status-text {
                    font-weight: 500;
                }

                .creator-intro {
                    animation: creatorFadeInUp 0.5s ease 0.3s backwards;
                }

                @keyframes creatorFadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .creator-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.2rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #d4af37, #e4c158);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 8px;
                }

                .creator-title {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin: 0;
                }

                .creator-summary {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                    border-radius: 16px;
                    padding: 28px;
                    margin-bottom: 32px;
                    position: relative;
                    animation: creatorFadeInUp 0.5s ease 0.4s backwards;
                }

                .summary-icon {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d4af37;
                    margin-bottom: 16px;
                }

                .summary-text {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.95rem;
                    line-height: 1.8;
                    margin: 0;
                }

                .creator-socials {
                    animation: creatorFadeInUp 0.5s ease 0.5s backwards;
                }

                .socials-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    color: white;
                    margin: 0 0 20px;
                    text-align: center;
                }

                .socials-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 32px;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(212, 175, 55, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }

                .social-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d4af37;
                    flex-shrink: 0;
                }

                .social-link.github:hover .social-icon {
                    background: linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.1));
                    color: #58a6ff;
                }

                .social-link.linkedin:hover .social-icon {
                    background: linear-gradient(135deg, rgba(10, 102, 194, 0.2), rgba(10, 102, 194, 0.1));
                    color: #0a66c2;
                }

                .social-link.email:hover .social-icon {
                    background: linear-gradient(135deg, rgba(234, 67, 53, 0.2), rgba(234, 67, 53, 0.1));
                    color: #ea4335;
                }

                .social-link.twitter:hover .social-icon {
                    background: linear-gradient(135deg, rgba(29, 155, 240, 0.2), rgba(29, 155, 240, 0.1));
                    color: #1d9bf0;
                }

                .social-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    flex: 1;
                }

                .social-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .social-handle {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }

                .creator-footer {
                    text-align: center;
                    animation: creatorFadeInUp 0.5s ease 0.6s backwards;
                }

                .footer-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
                    border: 1px solid rgba(212, 175, 55, 0.3);
                    border-radius: 100px;
                    color: #d4af37;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                @media (max-width: 1024px) {
                    .nav-link {
                        padding: 8px 14px;
                        font-size: 0.85rem;
                    }
                    
                    .nav-label {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .premium-navbar {
                        height: 70px;
                        padding: 0 5%;
                    }

                    .mobile-menu-btn {
                        display: flex;
                    }

                    .nav-options {
                        position: fixed;
                        top: 70px;
                        left: 0;
                        right: 0;
                        background: rgba(10, 14, 39, 0.98);
                        backdrop-filter: blur(20px);
                        flex-direction: column;
                        padding: 20px;
                        gap: 8px;
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .nav-options.mobile-open {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }

                    .nav-link {
                        width: 100%;
                        padding: 14px 20px;
                        justify-content: flex-start;
                    }

                    .nav-label {
                        display: block;
                    }

                    .creator-modal-content {
                        padding: 40px 24px 32px;
                    }

                    .socials-grid {
                        grid-template-columns: 1fr;
                    }

                    .creator-name {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;