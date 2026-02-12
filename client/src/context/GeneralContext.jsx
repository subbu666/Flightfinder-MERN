import React, { createContext, useState } from 'react';
import api from "../config/axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const [ticketBookingDate, setTicketBookingDate] = useState();

  const inputs = {username, email, usertype, password};

  // Premium Modal State
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    onConfirm: null,
    showCancel: false
  });

  const navigate = useNavigate();

  // Premium Modal Functions
  const showModal = (title, message, type = 'info', onConfirm = null, showCancel = false) => {
    setModal({
      show: true,
      title,
      message,
      type,
      onConfirm,
      showCancel
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  const showSuccess = (title, message, onConfirm = null) => {
    showModal(title, message, 'success', onConfirm);
  };

  const showError = (title, message, onConfirm = null) => {
    showModal(title, message, 'error', onConfirm);
  };

  const showWarning = (title, message, onConfirm = null, showCancel = false) => {
    showModal(title, message, 'warning', onConfirm, showCancel);
  };

  const showInfo = (title, message, onConfirm = null) => {
    showModal(title, message, 'info', onConfirm);
  };

  const login = async () => {
    try {
      const loginInputs = { email, password };
      
      const response = await api.post('/login', loginInputs);
      
      // Store user data
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('userType', response.data.usertype);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);

      // Show success message with navigation callback
      showSuccess(
        'Welcome Back!', 
        `Hello ${response.data.username}, you've successfully logged in.`,
        () => {
          // Navigate after modal is closed
          if (response.data.usertype === 'customer') {
            navigate('/');
          } else if (response.data.usertype === 'admin') {
            navigate('/admin');
          } else if (response.data.usertype === 'flight-operator') {
            navigate('/flight-admin');
          }
        }
      );

    } catch (err) {
      console.error('Login Error:', err);

      // Handle different error types from backend
      if (err.response) {
        const { status, data } = err.response;
        const errorType = data.errorType;
        const errorMessage = data.message;

        switch (errorType) {
          case 'USER_NOT_FOUND':
            showError(
              'Account Not Found', 
              'No account exists with this email address. Would you like to create a new account?'
            );
            break;

          case 'EMAIL_NOT_VERIFIED':
            showError(
              'Email Not Verified', 
              'Please verify your email first. Check your inbox for the verification code.'
            );
            break;

          case 'INVALID_PASSWORD':
            showError(
              'Invalid Password', 
              'The password you entered is incorrect. Please try again or use "Forgot Password" if needed.'
            );
            break;

          case 'APPROVAL_PENDING':
            if (data.approvalStatus === 'not-approved') {
              showWarning(
                'Approval Pending', 
                'Your flight operator account is waiting for admin approval. You will receive an email once approved.'
              );
            } else if (data.approvalStatus === 'rejected') {
              showError(
                'Account Rejected', 
                'Your flight operator account has been rejected. Please contact support for more information.'
              );
            }
            break;

          case 'VALIDATION_ERROR':
            showError(
              'Missing Information', 
              'Please provide both email and password to login.'
            );
            break;

          default:
            // Generic error message
            showError(
              'Login Failed', 
              errorMessage || 'Unable to login. Please check your credentials and try again.'
            );
        }
      } else if (err.request) {
        // Network error - no response received
        showError(
          'Connection Error', 
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } else {
        // Something else happened
        showError(
          'Login Failed', 
          'An unexpected error occurred. Please try again later.'
        );
      }
    }
  };
  
  const register = async () =>{
    try{
        await api.post('/register', inputs)
        .then( async (res)=>{
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('userType', res.data.usertype);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);

            showSuccess(
              'Registration Successful!', 
              `Welcome ${res.data.username}! Your account has been created.`,
              () => {
                if(res.data.usertype === 'customer'){
                    navigate('/');
                } else if(res.data.usertype === 'admin'){
                    navigate('/admin');
                } else if(res.data.usertype === 'flight-operator'){
                  navigate('/flight-admin');
                }
              }
            );

        }).catch((err) =>{
            showError('Registration Failed', 'Unable to create account. Please try again.');
            console.log(err);
        });
    }catch(err){
        showError('Registration Failed', 'Something went wrong. Please try again later.');
        console.log(err);
    }
  }



  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    showSuccess(
      'Logged Out', 
      'You have been successfully logged out.',
      () => {
        navigate('/');
      }
    );
  }



  return (
    <GeneralContext.Provider value={{
      login, register, logout, 
      username, setUsername, 
      email, setEmail, 
      password, setPassword, 
      usertype, setUsertype, 
      ticketBookingDate, setTicketBookingDate,
      modal, setModal,
      showModal, hideModal,
      showSuccess, showError, showWarning, showInfo
    }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider