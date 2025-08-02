import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login({ onClose, onSwitchToSignup }) {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    // console.log('Login:', formData);

    const response = await axios.post("http://localhost:5000/user/login", {formData}, {withCredentials:true});
    console.log(response.data);
    if(response.data === "userLoggedin"){
      toast.success("Logged in");
      // console.log('Login:', formData);
      navigate("/");
    }
    if(response.data === "notFound"){
      toast.error("User not Found !!");
      navigate("/user/signup");
    }
    if(response.data === "invalid"){
      toast.error("Incorrect Credentials !!");
      navigate("/user/login");
    }
  };

  return (
    <div className="modal d-block auth-modal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center">Welcome Back</h5>
            <a href="/">
              {/* <button 
                type="button" 
                className="btn-close " 
                onClick={onClose}
              ></button> */}
            <button type="button" 
              class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="sr-only">Close menu</span>

              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </a>
          </div>
          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg w-100 mb-3 transform transition-all ease-in-out duration-300 hover:scale-95"
              >
                Login
              </button>
            </form>
            
            <p className="text-center mb-0">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="btn btn-link p-0 text-decoration-none"
              >
                <a href="/user/signup">Sign up</a>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;