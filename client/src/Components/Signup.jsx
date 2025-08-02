import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Signup({ onClose, onSwitchToLogin }) {



  const navigate = useNavigate();

  // useEffect(() => {
  //   const init = async () => {

  //     const err = await axios.get("http://localhost:5000/user/signup");
  //     if(err) {
  //       console.log(err);
  //     }
  //   }

  //   init();
  // }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    profileImage: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);

    if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
    }

    const response = await axios.post("http://localhost:5000/user/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    // console.log(formData);
    // const response = await axios.post("http://localhost:5000/user/signup", {formData});
    if(response.data === "userCreated"){
      toast.success("User Created! Please Login", {
        autoClose: 4000,
      })
      console.log(formData);
      navigate("/user/login");
    }
    if(response.data === "userExists"){
      toast.error("User Already exists!! Please Login", {
        autoClose: 4000,
      });
      navigate("/user/login");
    }
  };

  return (
    <div className="modal d-block auth-modal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center">Create Account</h5>
            <a href="/">
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
            <form method="POST">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
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
              
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Profile Image <i>(Optional)</i> </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={
                    async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onloadend = () => {
                              setFormData({ ...formData, profileImage: reader.result }); // Store Base64 string
                          };
                      }
                    }
                  }
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg w-100 mb-3 transform transition-all ease-in-out duration-300 hover:scale-95"
                onClick={handleSubmit}
              >
                <a style={{textDecoration:"none", color:"white"}} href="/">Sign up</a>
              </button>
            </form>
            
            <p className="text-center mb-0">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="btn btn-link p-0 text-decoration-none"
              >
                <a href="/user/login">Login</a>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;