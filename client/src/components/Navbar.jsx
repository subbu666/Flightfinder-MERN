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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

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
                }
            `}</style>
        </>
    );
};

export default Navbar;