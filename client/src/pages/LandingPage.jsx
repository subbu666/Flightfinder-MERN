import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import api from '../config/axios';

const LandingPage = () => {

  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [Flights, setFlights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFlightAnimation, setShowFlightAnimation] = useState(false);
  const [searchResults, setSearchResults] = useState({ total: 0, filtered: 0 });

  const navigate = useNavigate();
  const { setTicketBookingDate, showError } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, [navigate]);

  const cities = [
    { value: 'Chennai', label: 'Chennai', code: 'MAA' },
    { value: 'Bangalore', label: 'Bangalore', code: 'BLR' },
    { value: 'Hyderabad', label: 'Hyderabad', code: 'HYD' },
    { value: 'Mumbai', label: 'Mumbai', code: 'BOM' },
    { value: 'Indore', label: 'Indore', code: 'IDR' },
    { value: 'Delhi', label: 'Delhi', code: 'DEL' },
    { value: 'Pune', label: 'Pune', code: 'PNQ' },
    { value: 'Trivendrum', label: 'Trivandrum', code: 'TRV' },
    { value: 'Bhopal', label: 'Bhopal', code: 'BHO' },
    { value: 'Kolkata', label: 'Kolkata', code: 'CCU' },
    { value: 'varanasi', label: 'Varanasi', code: 'VNS' },
    { value: 'Jaipur', label: 'Jaipur', code: 'JAI' }
  ];

  const normalizeDate = (d) => {
    if (!d) return '';
    if (typeof d === 'string') return d.slice(0, 10);
    const date = new Date(d);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTodayString = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Formats "2026-02-05" → "Thursday, 5th February 2026"
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const suffixes = { 1:'st', 2:'nd', 3:'rd' };
    const suffix = (d >= 11 && d <= 13) ? 'th' : (suffixes[d % 10] || 'th');
    return `${days[date.getDay()]}, ${d}${suffix} ${months[m - 1]} ${y}`;
  };

  const fetchFlights = async () => {
    setIsSearching(true);
    setError('');
    setShowFlightAnimation(true); // Show flight animation

    const today = getTodayString();

    if (checkBox) {
      if (departure !== "" && destination !== "" && departureDate && returnDate) {
        if (departureDate >= today && returnDate > departureDate) {
          try {
            const response = await api.get('/fetch-flights', { params: { date: departureDate } });
            
            // Wait for flight animation to complete (5 seconds)
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            setFlights(response.data);
            
            // Calculate filtered flights
            const filtered = response.data.filter(Flight => {
              const matchesRoute =
                (Flight.origin === departure && Flight.destination === destination) ||
                (Flight.origin === destination && Flight.destination === departure);
              const flightDate = normalizeDate(Flight.journeyDate);
              const matchesDate = flightDate === departureDate || flightDate === returnDate;
              return matchesRoute && matchesDate;
            });
            
            setSearchResults({ total: response.data.length, filtered: filtered.length });
            setShowFlightAnimation(false); // Hide flight animation
            
            // Small delay before showing modal for smooth transition
            setTimeout(() => {
              setShowModal(true);
            }, 300);
          } catch (err) {
            setShowFlightAnimation(false);
            showError('Search Failed', 'Unable to fetch flights. Please try again.');
          }
        } else {
          setShowFlightAnimation(false);
          setError("Please check the dates");
        }
      } else {
        setShowFlightAnimation(false);
        setError("Please fill all the inputs");
      }
    } else {
      if (departure !== "" && destination !== "" && departureDate) {
        if (departureDate >= today) {
          try {
            const response = await api.get('/fetch-flights', { params: { date: departureDate } });
            
            // Wait for flight animation to complete (5 seconds)
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            setFlights(response.data);
            
            // Calculate filtered flights
            const filtered = response.data.filter(Flight =>
              Flight.origin === departure &&
              Flight.destination === destination &&
              normalizeDate(Flight.journeyDate) === departureDate
            );
            
            setSearchResults({ total: response.data.length, filtered: filtered.length });
            setShowFlightAnimation(false); // Hide flight animation
            
            // Small delay before showing modal for smooth transition
            setTimeout(() => {
              setShowModal(true);
            }, 300);
          } catch (err) {
            setShowFlightAnimation(false);
            showError('Search Failed', 'Unable to fetch flights. Please try again.');
          }
        } else {
          setShowFlightAnimation(false);
          setError("Please check the dates");
        }
      } else {
        setShowFlightAnimation(false);
        setError("Please fill all the inputs");
      }
    }
    setIsSearching(false);
  };

  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
        navigate(`/book-flight/${id}`);
      } else if (destination === departure) {
        setTicketBookingDate(returnDate);
        navigate(`/book-flight/${id}`);
      }
    } else {
      showError('Login Required', 'Please login to book your flight.');
      setTimeout(() => navigate('/auth'), 1500);
    }
  };

  const swapCities = () => {
    setDeparture(destination);
    setDestination(departure);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const viewFlights = () => {
    setShowModal(false);
    // Smooth scroll to flights section
    setTimeout(() => {
      const flightsSection = document.querySelector('.flights-section');
      if (flightsSection) {
        flightsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); // Small delay to let modal close animation complete
  };

  const filteredFlights = checkBox
    ? Flights.filter(Flight => {
      const matchesRoute =
        (Flight.origin === departure && Flight.destination === destination) ||
        (Flight.origin === destination && Flight.destination === departure);
      const flightDate = normalizeDate(Flight.journeyDate);
      const matchesDate = flightDate === departureDate || flightDate === returnDate;
      return matchesRoute && matchesDate;
    })
    : Flights.filter(Flight =>
      Flight.origin === departure &&
      Flight.destination === destination &&
      normalizeDate(Flight.journeyDate) === departureDate
    );

  return (
    <div className="landing-page">
      {/* ... rest of JSX remains exactly the same ... */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="badge-premium">
              <span className="status-dot active"></span>
              Premium Flight Experience
            </div>
            <h1>
              Discover the World
              <span className="text-gradient"> Above the Clouds</span>
            </h1>
            <p>Book extraordinary journeys to unforgettable destinations. Experience luxury travel with SB Flights.</p>
          </div>

          <div className="search-card">
            <div className="search-header">
              <h3>Find Your Flight</h3>
              <label className="toggle-return">
                <input
                  type="checkbox"
                  checked={checkBox}
                  onChange={(e) => setCheckBox(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Return Journey</span>
              </label>
            </div>

            <div className="search-form">
              <div className="route-inputs">
                <div className="input-group">
                  <label>From</label>
                  <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label} ({city.code})</option>
                    ))}
                  </select>
                </div>

                <button className="swap-btn" onClick={swapCities} type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0-12l4 4m-4-4l-4 4" />
                  </svg>
                </button>

                <div className="input-group">
                  <label>To</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>{city.label} ({city.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="date-inputs">
                <div className="input-group">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>

                {checkBox && (
                  <div className="input-group">
                    <label>Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="btn-premium btn-search"
                onClick={fetchFlights}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Searching...
                  </span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    Search Flights
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Animation Overlay */}
      {showFlightAnimation && (
        <div className="flight-animation-overlay">
          <div className="flight-animation-container">
            <div className="flight-route-animation">
              <div className="route-city from-city">
                <div className="city-marker">
                  <div className="marker-pulse"></div>
                  <div className="marker-dot"></div>
                </div>
                <div className="city-label">
                  <span className="city-code">{cities.find(c => c.value === departure)?.code || departure}</span>
                  <span className="city-name">{departure}</span>
                </div>
              </div>

              <div className="flight-path-container">
                <svg className="flight-path-svg" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(212, 175, 55, 0.3)" />
                      <stop offset="50%" stopColor="rgba(212, 175, 55, 0.6)" />
                      <stop offset="100%" stopColor="rgba(212, 175, 55, 0.3)" />
                    </linearGradient>
                  </defs>
                  <path 
                    className="flight-path-line" 
                    d="M 0 50 Q 200 10, 400 50" 
                    stroke="url(#pathGradient)" 
                    strokeWidth="2" 
                    fill="none"
                    strokeDasharray="8 4"
                  />
                </svg>
                
                <div className="animated-plane">
                  <svg className="plane-svg" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg  ">
                    <g transform="translate(5, 20)">
                      {/* Main fuselage body */}
                      <ellipse cx="25" cy="0" rx="24" ry="5" fill="#d4af37" opacity="0.9"/>
                      
                      {/* Nose cone */}
                      <path d="M 48 0 L 52 -1.5 L 52 1.5 Z" fill="#e4c158"/>
                      
                      {/* Cockpit windows */}
                      <ellipse cx="42" cy="-1" rx="3" ry="1.5" fill="#1a2545" opacity="0.7"/>
                      <ellipse cx="38" cy="-1" rx="2.5" ry="1.3" fill="#1a2545" opacity="0.6"/>
                      
                      {/* Main wings */}
                      <path d="M 25 0 L 18 -12 L 32 -3 L 30 0 Z" fill="#e4c158" stroke="#d4af37" strokeWidth="0.5"/>
                      <path d="M 25 0 L 18 12 L 32 3 L 30 0 Z" fill="#e4c158" stroke="#d4af37" strokeWidth="0.5"/>
                      
                      {/* Tail wings */}
                      <path d="M 2 0 L -2 -7 L 8 -2 L 6 0 Z" fill="#c9a961" stroke="#d4af37" strokeWidth="0.5"/>
                      <path d="M 2 0 L -2 7 L 8 2 L 6 0 Z" fill="#c9a961" stroke="#d4af37" strokeWidth="0.5"/>
                      
                      {/* Vertical stabilizer */}
                      <path d="M 0 0 L -3 -8 L 4 -1 Z" fill="#c9a961" stroke="#d4af37" strokeWidth="0.5"/>
                      
                      {/* Engine details */}
                      <ellipse cx="20" cy="-6" rx="2.5" ry="2" fill="#b89d4f" opacity="0.8"/>
                      <ellipse cx="20" cy="6" rx="2.5" ry="2" fill="#b89d4f" opacity="0.8"/>
                      
                      {/* Engine glow effect */}
                      <circle cx="20" cy="-6" r="1.5" fill="#ffd700" opacity="0.6">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="0.8s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="20" cy="6" r="1.5" fill="#ffd700" opacity="0.6">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="0.8s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                  </svg>
                  <div className="plane-trail"></div>
                  <div className="plane-glow"></div>
                </div>

                <div className="flight-clouds">
                  <div className="cloud cloud-1">☁️</div>
                  <div className="cloud cloud-2">☁️</div>
                  <div className="cloud cloud-3">☁️</div>
                </div>
              </div>

              <div className="route-city to-city">
                <div className="city-marker">
                  <div className="marker-pulse"></div>
                  <div className="marker-dot"></div>
                </div>
                <div className="city-label">
                  <span className="city-code">{cities.find(c => c.value === destination)?.code || destination}</span>
                  <span className="city-name">{destination}</span>
                </div>
              </div>
            </div>

            <div className="searching-text">
              <div className="searching-spinner"></div>
              <h3>Searching for flights...</h3>
              <p>Finding the best options for your journey</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-content">
              <div className="modal-icon-wrapper">
                <div className="modal-icon-circle">
                  <svg className="modal-checkmark" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="modal-success-ripple"></div>
              </div>

              <h2 className="modal-title">Flights Found Successfully!</h2>
              <p className="modal-subtitle">We've searched our database and found available flights for you</p>

              <div className="modal-stats">
                <div className="stat-card stat-primary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                      <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                      <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{searchResults.filtered}</div>
                    <div className="stat-label">Available Flights</div>
                  </div>
                </div>

                <div className="stat-card stat-secondary">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-route">{departure} → {destination}</div>
                    <div className="stat-label">Your Route</div>
                  </div>
                </div>
              </div>

              <div className="modal-journey-info">
                <div className="journey-detail">
                  <span className="journey-label">Departure</span>
                  <span className="journey-value">{formatDateDisplay(departureDate)}</span>
                </div>
                {checkBox && returnDate && (
                  <div className="journey-detail">
                    <span className="journey-label">Return</span>
                    <span className="journey-value">{formatDateDisplay(returnDate)}</span>
                  </div>
                )}
              </div>

              <button className="modal-btn-view" onClick={viewFlights}>
                <span>View Available Flights</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {Flights.length > 0 && (
        <section className="flights-section">
          <div className="section-header">
            <h2>Available Flights</h2>
            <p>{filteredFlights.length} flights found from {departure} to {destination}</p>
          </div>

          <div className="flights-grid">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((Flight) => (
                <div className="flight-card" key={Flight._id}>
                  <div className="flight-header">
                    <div className="airline-info">
                      <div className="airline-logo">{Flight.flightName.charAt(0)}</div>
                      <div>
                        <h4>{Flight.flightName}</h4>
                        <span className="flight-number">{Flight.flightId}</span>
                      </div>
                    </div>
                    <div className="price-tag">
                      <span className="currency">₹</span>
                      <span className="amount">{Flight.basePrice}</span>
                      <span className="per">/person</span>
                    </div>
                  </div>

                  <div className="flight-route">
                    <div className="route-point">
                      <span className="time">{Flight.departureTime}</span>
                      <span className="city">{Flight.origin}</span>
                    </div>
                    <div className="route-line">
                      <span className="duration">{Flight.duration || '2h 30m'}</span>
                      <div className="line">
                        <div className="plane-icon">✈</div>
                      </div>
                      <span className="stops">Direct</span>
                    </div>
                    <div className="route-point">
                      <span className="time">{Flight.arrivalTime}</span>
                      <span className="city">{Flight.destination}</span>
                    </div>
                  </div>

                  <div className="flight-footer">
                    <div className="seats-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                        <path d="M12 11h.01" />
                      </svg>
                      {Flight.totalSeats} seats available
                    </div>
                    <button
                      className="btn-premium btn-book"
                      onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}
                    >
                      Book Now
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-flights">
                <div className="no-flights-icon-wrap">
                  <div className="no-flights-icon">✈️</div>
                </div>
                <h3>No Flights Available</h3>
                <div className="no-flights-route">
                  <span className="nf-city">{departure}</span>
                  <span className="nf-arrow">→</span>
                  <span className="nf-city">{destination}</span>
                </div>
                <div className="no-flights-dates">
                  <span className="nf-date-label">Departure</span>
                  <span className="nf-date-value">{formatDateDisplay(departureDate)}</span>
                  {checkBox && returnDate && (
                    <>
                      <span className="nf-date-label">Return</span>
                      <span className="nf-date-value">{formatDateDisplay(returnDate)}</span>
                    </>
                  )}
                </div>
                <div className="no-flights-suggestions">
                  <p className="nf-suggest-title">Here's what you can try:</p>
                  <div className="nf-tags">
                    <span className="nf-tag">📅 Pick different dates</span>
                    <span className="nf-tag">🗺️ Try nearby cities</span>
                    <span className="nf-tag">🔄 Swap origin & destination</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- NEW: Show no-flights block when API returned data but zero match the route/date ---- */}
      {Flights.length === 0 && departure && destination && departureDate && !isSearching && (
        <section className="flights-section">
          <div className="flights-grid">
            <div className="no-flights">
              <div className="no-flights-icon-wrap">
                <div className="no-flights-icon">✈️</div>
              </div>
              <h3>No Flights Available</h3>
              <div className="no-flights-route">
                <span className="nf-city">{departure}</span>
                <span className="nf-arrow">→</span>
                <span className="nf-city">{destination}</span>
              </div>
              <div className="no-flights-dates">
                <span className="nf-date-label">Departure</span>
                <span className="nf-date-value">{formatDateDisplay(departureDate)}</span>
                {checkBox && returnDate && (
                  <>
                    <span className="nf-date-label">Return</span>
                    <span className="nf-date-value">{formatDateDisplay(returnDate)}</span>
                  </>
                )}
              </div>
              <div className="no-flights-suggestions">
                <p className="nf-suggest-title">Here's what you can try:</p>
                <div className="nf-tags">
                  <span className="nf-tag">📅 Pick different dates</span>
                  <span className="nf-tag">🗺️ Try nearby cities</span>
                  <span className="nf-tag">🔄 Swap origin & destination</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="about" className="section-about">
        <div className="about-container">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <p className="about-paragraph">
              Welcome to our Flight ticket booking app, where we are dedicated to providing you with an exceptional travel experience from start to finish. Whether you're embarking on a daily commute, planning an exciting cross-country adventure, or seeking a leisurely scenic route, our app offers an extensive selection of Flight options to cater to your unique travel preferences.
            </p>
            <p className="about-paragraph">
              We understand the importance of convenience and efficiency in your travel plans. Our user-friendly interface allows you to effortlessly browse through a wide range of Flight schedules, compare fares, and choose the most suitable seating options. With just a few taps, you can secure your Flight tickets and be one step closer to your desired destination. Our intuitive booking process enables you to customize your travel preferences, such as selecting specific departure times, opting for a window seat, or accommodating any special requirements.
            </p>
            <p className="about-paragraph">
              With our Flight ticket booking app, you can embrace the joy of exploring new destinations, immerse yourself in breathtaking scenery, and create cherished memories along the way. Start your journey today and let us be your trusted companion in making your Flight travel dreams a reality. Experience the convenience, reliability, and comfort that our app offers, and embark on unforgettable Flight adventures with confidence.
            </p>
            <div className="about-footer-text">
              <h5>2026 SB Flights - &copy; All rights reserved</h5>
            </div>
          </div>
        </div>
      </section>

      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 10V22L16 30L28 22V10L16 2Z" stroke="#d4af37" strokeWidth="2" fill="none" />
                <path d="M16 8L10 12V20L16 24L22 20V12L16 8Z" fill="#d4af37" />
              </svg>
            </div>
            <div>
              <h4>SB Flights</h4>
              <p>Premium Flight Booking Experience</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#/">Terms of Service</a>
            <a href="#/">Privacy Policy</a>
            <a href="#/">Contact Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 SB Flights. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #0a0e27;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 5% 60px;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0e27 0%, #141d4a 50%, #0a0e27 100%);
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(0, 212, 170, 0.06) 0%, transparent 50%);
        }

        .animated-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #00d4aa, #00aa88);
          bottom: 10%;
          left: -50px;
          animation-delay: -5s;
        }

        .shape-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          top: 40%;
          right: 20%;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: center;
        }

        .hero-text {
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 100px;
          font-size: 0.85rem;
          color: #d4af37;
          margin-bottom: 24px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d4af37;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-text h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-text h1 span {
          display: block;
        }

        .text-gradient {
          background: linear-gradient(135deg, #d4af37, #00d4aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          max-width: 480px;
        }

        .search-card {
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
          animation: slideInRight 0.8s ease;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .search-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .search-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: white;
          margin: 0;
        }

        .toggle-return {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .toggle-return input {
          display: none;
        }

        .toggle-slider {
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          transition: background 0.3s ease;
        }

        .toggle-slider::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }

        .toggle-return input:checked + .toggle-slider {
          background: #d4af37;
        }

        .toggle-return input:checked + .toggle-slider::after {
          transform: translateX(20px);
        }

        .toggle-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .route-inputs {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 12px;
          align-items: end;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-group select,
        .input-group input {
          height: 52px;
          padding: 0 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .input-group select:focus,
        .input-group input:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255, 255, 255, 0.08);
        }

        .input-group select option {
          background: #161b22;
          color: white;
        }

        .swap-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          color: #d4af37;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 4px;
        }

        .swap-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: rotate(180deg);
        }

        .date-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .error-message {
          padding: 12px 16px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 8px;
          color: #ff6b7a;
          font-size: 0.9rem;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(10, 14, 39, 0.3);
          border-top-color: #0a0e27;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .btn-search {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* ========== FLIGHT ANIMATION OVERLAY ========== */
        .flight-animation-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 39, 0.98);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: overlayFadeIn 0.4s ease;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .flight-animation-container {
          width: 90%;
          max-width: 800px;
          padding: 60px 40px;
        }

        .flight-route-animation {
          display: grid;
          grid-template-columns: 180px 1fr 180px;
          gap: 0;
          align-items: center;
          margin-bottom: 60px;
        }

        .route-city {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .city-marker {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-dot {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
          position: relative;
          z-index: 2;
          animation: markerPulse 2s ease-in-out infinite;
        }

        @keyframes markerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .marker-pulse {
          position: absolute;
          inset: 0;
          border: 2px solid #d4af37;
          border-radius: 50%;
          animation: markerRipple 2s ease-out infinite;
        }

        @keyframes markerRipple {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .city-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          animation: cityLabelFade 0.6s ease 0.3s backwards;
        }

        @keyframes cityLabelFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .city-code {
          font-size: 1.8rem;
          font-weight: 700;
          color: #d4af37;
          letter-spacing: 2px;
        }

        .city-name {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .flight-path-container {
          position: relative;
          height: 100px;
          padding: 0 20px;
        }

        .flight-path-svg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .flight-path-line {
          animation: drawPath 1s ease 0.5s backwards;
        }

        @keyframes drawPath {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        .animated-plane {
          position: absolute;
          top: 0;
          left: 0;
          animation: flyPlane 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.5s forwards;
          filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.4));
          transform-origin: center;
        }

        @keyframes flyPlane {
          0% {
            left: -5%;
            top: 65%;
            transform: translate(-50%, -50%) rotate(-35deg) scale(0.75);
            opacity: 0.8;
          }
          10% {
            left: 10%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(-25deg) scale(0.85);
            opacity: 1;
          }
          25% {
            left: 25%;
            top: 30%;
            transform: translate(-50%, -50%) rotate(-12deg) scale(0.95);
          }
          40% {
            left: 40%;
            top: 18%;
            transform: translate(-50%, -50%) rotate(-5deg) scale(1);
          }
          50% {
            left: 50%;
            top: 12%;
            transform: translate(-50%, -50%) rotate(0deg) scale(1.05);
          }
          60% {
            left: 60%;
            top: 15%;
            transform: translate(-50%, -50%) rotate(5deg) scale(1);
          }
          75% {
            left: 75%;
            top: 30%;
            transform: translate(-50%, -50%) rotate(15deg) scale(0.95);
          }
          90% {
            left: 90%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(28deg) scale(0.85);
          }
          100% {
            left: 105%;
            top: 65%;
            transform: translate(-50%, -50%) rotate(35deg) scale(0.75);
            opacity: 0.8;
          }
        }

        .plane-trail {
          position: absolute;
          top: 50%;
          right: 100%;
          width: 100px;
          height: 4px;
          background: linear-gradient(to left, rgba(212, 175, 55, 0.9), rgba(212, 175, 55, 0.5), transparent);
          transform: translateY(-50%);
          border-radius: 2px;
          filter: blur(1.5px);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .plane-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: glowPulse 1.5s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }

        .flight-clouds {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .cloud {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: floatCloud 8s linear infinite;
        }

        .cloud-1 {
          top: 20%;
          animation-delay: 0s;
        }

        .cloud-2 {
          top: 60%;
          animation-delay: 2s;
        }

        .cloud-3 {
          top: 40%;
          animation-delay: 4s;
        }

        @keyframes floatCloud {
          0% {
            left: -10%;
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            left: 110%;
            transform: translateY(0);
          }
        }

        .searching-text {
          text-align: center;
          animation: searchTextFade 0.6s ease 0.8s backwards;
        }

        @keyframes searchTextFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .searching-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(212, 175, 55, 0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          margin: 0 auto 24px;
          animation: searchSpin 1s linear infinite;
        }

        @keyframes searchSpin {
          to { transform: rotate(360deg); }
        }

        .searching-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: white;
          margin: 0 0 8px;
        }

        .searching-text p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        /* ========== END FLIGHT ANIMATION ========== */

        /* ========== MODAL STYLES ========== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.98) 0%, rgba(13, 17, 23, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 175, 55, 0.15);
          animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes modalSlideUp {
          from { 
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-close {
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

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: rotate(90deg);
        }

        .modal-content {
          padding: 50px 40px 40px;
          text-align: center;
        }

        .modal-icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 32px;
        }

        .modal-icon-circle {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(212, 175, 55, 0.15));
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: modalIconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }

        @keyframes modalIconPop {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-checkmark {
          color: #d4af37;
          animation: drawCheck 0.5s ease 0.4s backwards;
        }

        @keyframes drawCheck {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
        }

        .modal-success-ripple {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          animation: ripple 1.5s ease-out 0.3s infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0 0 12px;
          animation: fadeInUp 0.5s ease 0.3s backwards;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 36px;
          line-height: 1.6;
          animation: fadeInUp 0.5s ease 0.4s backwards;
        }

        .modal-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
          animation: fadeInUp 0.5s ease 0.5s backwards;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }

        .stat-primary {
          border-color: rgba(212, 175, 55, 0.2);
        }

        .stat-secondary {
          border-color: rgba(0, 212, 170, 0.2);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border-radius: 12px;
          flex-shrink: 0;
        }

        .stat-primary .stat-icon {
          color: #d4af37;
        }

        .stat-secondary .stat-icon {
          color: #00d4aa;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 212, 170, 0.05));
        }

        .stat-content {
          text-align: left;
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-route {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-journey-info {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 32px;
          animation: fadeInUp 0.5s ease 0.6s backwards;
        }

        .journey-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }

        .journey-detail:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .journey-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .journey-value {
          font-size: 0.95rem;
          color: #d4af37;
          font-weight: 500;
        }

        .modal-btn-view {
          width: 100%;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #d4af37, #e4c158);
          border: none;
          border-radius: 14px;
          color: #0a0e27;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
          animation: fadeInUp 0.5s ease 0.7s backwards;
        }

        .modal-btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
        }

        .modal-btn-view:active {
          transform: translateY(0);
        }

        /* ========== END MODAL STYLES ========== */

        .flights-section {
          padding: 80px 5%;
          background: linear-gradient(180deg, #0a0e27 0%, #0f1538 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: white;
          margin-bottom: 8px;
        }

        .section-header p {
          color: rgba(255, 255, 255, 0.5);
        }

        .flights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .flight-card {
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.9) 0%, rgba(13, 17, 23, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .flight-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.1);
        }

        .flight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .airline-info {
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

        .airline-info h4 {
          font-size: 1rem;
          color: white;
          margin: 0;
        }

        .flight-number {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .price-tag {
          text-align: right;
        }

        .price-tag .currency {
          font-size: 1rem;
          color: #d4af37;
        }

        .price-tag .amount {
          font-size: 1.8rem;
          font-weight: 700;
          color: #d4af37;
        }

        .price-tag .per {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .flight-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 16px;
        }

        .route-point {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .route-point .time {
          font-size: 1.3rem;
          font-weight: 600;
          color: white;
        }

        .route-point .city {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .route-line {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
        }

        .route-line .duration {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }

        .route-line .line {
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .plane-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.2rem;
        }

        .route-line .stops {
          font-size: 0.75rem;
          color: #00d4aa;
          margin-top: 4px;
        }

        .flight-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .seats-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .btn-book {
          padding: 10px 24px;
          font-size: 0.9rem;
        }

        /* ========== NO FLIGHTS BLOCK ========== */
        .no-flights {
          grid-column: 1 / -1;
          text-align: center;
          padding: 64px 24px;
          animation: fadeInUp 0.5s ease;
        }

        .no-flights-icon-wrap {
          width: 100px;
          height: 100px;
          margin: 0 auto 28px;
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(220, 53, 69, 0.12), rgba(220, 53, 69, 0.06));
          border: 1px solid rgba(220, 53, 69, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-flights-icon {
          font-size: 2.8rem;
          filter: grayscale(0.3);
        }

        .no-flights h3 {
          font-family: 'Playfair Display', serif;
          color: white;
          font-size: 1.7rem;
          margin: 0 0 24px;
        }

        /* Route row: City → City */
        .no-flights-route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .nf-city {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .nf-arrow {
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.4rem;
          font-weight: 300;
        }

        /* Date pills */
        .no-flights-dates {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .nf-date-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.35);
          margin-top: 6px;
        }

        .nf-date-label:first-child {
          margin-top: 0;
        }

        .nf-date-value {
          display: inline-block;
          padding: 7px 18px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 8px;
          color: #d4af37;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Suggestion tags */
        .no-flights-suggestions {
          margin-top: 8px;
        }

        .nf-suggest-title {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          margin: 0 0 14px;
        }

        .nf-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .nf-tag {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.82rem;
          transition: all 0.25s ease;
        }

        .nf-tag:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }
        /* ========== END NO FLIGHTS ========== */

        /* About Section */
        .section-about {
          padding: 100px 5%;
          background: linear-gradient(180deg, #0f1538 0%, #0a0e27 100%);
        }

        .about-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: white;
          text-align: center;
          margin-bottom: 48px;
          position: relative;
        }

        .section-title::after {
          content: '';
          display: block;
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #d4af37, #00d4aa);
          margin: 16px auto 0;
          border-radius: 2px;
        }

        .about-content {
          background: linear-gradient(145deg, rgba(22, 27, 34, 0.6) 0%, rgba(13, 17, 23, 0.8) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .about-paragraph {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 24px;
          text-align: justify;
          text-indent: 2em;
        }

        .about-paragraph:last-of-type {
          margin-bottom: 32px;
        }

        .about-footer-text {
          text-align: center;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .about-footer-text h5 {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.95rem;
          font-weight: 500;
          margin: 0;
        }

        .premium-footer {
          background: linear-gradient(180deg, #0a0e27 0%, #070a1a 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 60px 5% 30px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-brand h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: white;
          margin: 0;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #d4af37;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-text h1 {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 5% 40px;
          }

          .hero-text h1 {
            font-size: 2.2rem;
          }

          .route-inputs {
            grid-template-columns: 1fr;
          }

          .swap-btn {
            transform: rotate(90deg);
            margin: 0 auto;
          }

          .date-inputs {
            grid-template-columns: 1fr;
          }

          .flights-grid {
            grid-template-columns: 1fr;
          }

          .about-content {
            padding: 32px 24px;
          }

          .about-paragraph {
            text-align: left;
          }

          .footer-content {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }

          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }

          .no-flights-route {
            flex-direction: column;
            gap: 6px;
          }

          .nf-arrow {
            transform: rotate(90deg);
          }

          .flight-animation-container {
            padding: 40px 20px;
          }

          .flight-route-animation {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          .from-city {
            order: 1;
          }

          .flight-path-container {
            order: 2;
            transform: rotate(90deg);
            margin: 20px 0;
          }

          .to-city {
            order: 3;
          }

          .city-code {
            font-size: 1.4rem;
          }

          .searching-text h3 {
            font-size: 1.4rem;
          }

          .modal-content {
            padding: 40px 24px 32px;
          }

          .modal-title {
            font-size: 1.6rem;
          }

          .modal-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage