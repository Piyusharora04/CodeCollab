import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import "./../../public/CSS/Navbar.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function Navbar({loginVal, signupVal}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(loginVal);
  const [showSignup, setShowSignup] = useState(signupVal);
  const [userProfileImage, setUserProfileImage] = useState("/Images/default.png");

  const navigate = useNavigate();

  const fetchToken = async () => {
    try {
        const response = await axios.get("http://localhost:5000/user/auth/check", { withCredentials: true });
        if(response.data.token){
          try{
            const decodedToken = jwtDecode(response.data.token);
            setUserProfileImage(decodedToken.profileImageUrl);
          }
          catch(err) {
            console.log("err fetching token : ",err);
          }
          setIsLoggedIn(true);
        }
    } catch (error) {
        console.error("Error fetching token", error);
    }
};

useEffect(() => {
  
  fetchToken();

}, []);

const handleLogout = async () => {
  const response = await axios.get("http://localhost:5000/user/logout",{withCredentials:true});
  if (response.data === "cleared"){
    toast.success("Logged Out !!");
    setTimeout(() => {
      setIsLoggedIn(false);
    }, 500);
    setIsLoggedIn(false);
  }
}

  return (
    <>
      <nav style={{backgroundColor:"rgba(0,0,50,1)"}} className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm">
        <div className="container" onClick={() => {
          if(showDropdown == true){
            setShowDropdown(false);
          }
        }}>
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src="/Images/CodeCollab.png" alt="" width="80px" style={{margin:"0px"}} />
          </a>        
          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <>
                <button 
                  id='login-btn'
                  className="btn btn-link text-light text-decoration-none me-3"
                >
                  <a style={{textDecoration:"none", color:"white"}} href="/user/login">Login</a>
                </button>
                <button 
                  id='signup-btn'
                  className="btn btn-primary"
                >
                  <a style={{textDecoration:"none", color:"white"}} href="/user/signup">Sign up</a>
                </button>
              </>
            ) : (
              <div className="dropdown">
                <div id='profileIcon'>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="btn btn-link p-0"
                  >
                    <img src={`${userProfileImage}`} alt="img" style={{width:"40px", height:"40px", borderRadius:"40px", objectFit:"contain", border:"1px solid white", boxSizing:"content-box"}} />
                  </button>
                </div>
                {showDropdown && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li><a className="dropdown-item" href="#">My Profile</a></li>
                    <li><a className="dropdown-item" href="#">My Rooms</a></li>
                    <li><a className="dropdown-item" href="#">Joined Rooms</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="/" onClick={handleLogout}>Logout</a></li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onSwitchToSignup={() => { 
            setShowLogin(false); 
            setShowSignup(true); 
          }} 
        />
      )}
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)} 
          onSwitchToLogin={() => { 
            setShowSignup(false); 
            setShowLogin(true); 
          }} 
        />
      )}
    </>
  );
};

export default Navbar;