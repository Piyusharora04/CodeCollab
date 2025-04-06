import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Users,
  Code2,
  Zap,
  Globe2,
  Lock,
  Video,
  Star,
  Users2,
} from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

function Home({ loginVal, signupVal }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const marqueeRef = useRef(null);
  const animationFrameId = useRef(null);
  const scrollAmount = useRef(0);
  const speed = useRef(1);

  const scrollMarquee = useCallback(() => {
    if (marqueeRef.current) {
      scrollAmount.current -= speed.current;
      
      // Reset position when half the content has scrolled
      if (scrollAmount.current <= -marqueeRef.current.scrollWidth / 2) {
        scrollAmount.current = 0;
      }
      
      marqueeRef.current.style.transform = `translateX(${scrollAmount.current}px)`;
    }
    
    // Store the animation frame ID
    animationFrameId.current = requestAnimationFrame(scrollMarquee);
  }, []);

  useEffect(() => {
    // Start the animation
    animationFrameId.current = requestAnimationFrame(scrollMarquee);

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [scrollMarquee]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/auth/check",
          { withCredentials: true }
        );
        if (response.data.token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching token", error);
      }
    };
    fetchToken();
  }, [signupVal, loginVal]);

  const features = [
    {
      icon: <Users className="text-primary" size={24} />,
      title: "Real-time Collaboration",
      description:
        "Code together with multiple developers in real-time with live cursors and presence indicators.",
    },
    {
      icon: <Code2 className="text-primary" size={24} />,
      title: "Multi-language Support",
      description:
        "Support for 30+ programming languages with syntax highlighting and intelligent code completion.",
    },
    {
      icon: <Zap className="text-primary" size={24} />,
      title: "Instant Compilation",
      description:
        "Run and test your code instantly with our integrated compiler and runtime environment.",
    },
    {
      icon: <Globe2 className="text-primary" size={24} />,
      title: "Cross-platform",
      description:
        "Access your coding rooms from any device, anywhere in the world.",
    },
    {
      icon: <Lock className="text-primary" size={24} />,
      title: "Secure Rooms",
      description:
        "Private rooms with access control and encryption for your sensitive projects.",
    },
    {
      icon: <Video className="text-primary" size={24} />,
      title: "Video Conferencing",
      description:
        "Built-in video chat for seamless communication with your team members.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "CodeSync has revolutionized our team's collaboration. The real-time features and code compilation make pair programming a breeze.",
    },
    {
      name: "Michael Chen",
      role: "Tech Lead",
      company: "InnovateLabs",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "The best code collaboration platform I've ever used. The video chat integration makes remote work feel natural.",
    },
    {
      name: "Emily Rodriguez",
      role: "Full Stack Developer",
      company: "WebFlow",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "Security and ease of use in one package. Perfect for our team's needs.",
    },
  ];

  return (
    <>
      <div className="navbar mb-10">
        <Navbar loginVal={loginVal} signupVal={signupVal} />
      </div>
      <main className="w-[100%]">
        <section className="hero w-[100%] md:h-[37rem] lg:h-[37rem] relative flex pt-4 pb-4 pl-3 pr-0 gap-5 flex-col md:flex-row lg:flex-row md:justify lg:justify-between justify-between bg-slate-900">
          <div className="headings flex flex-col gap-4 md:gap-6 lg:gap-9 z-3 md:w-[50%] lg:w-[50%] w-full">
            <h1>
              <span className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
                Code Together,
              </span>
              <br />
              <br />
              <span className="text-blue-500 text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
                Build Together
              </span>
            </h1>
            <p className="text-gray-400 w-[90%] md:w-[50%] lg:w-[50%] text-md md:text-lg lg:text-xl">
              Experience real-time code collaboration like never before. Create
              or join a room and start coding with developers worldwide
              instantly.
            </p>
            {/* Action Buttons */}
            <div className="buttons ">
              <button  className="bg-blue-600 w-[10rem] rounded-full btn btn-room sm:p-3 sm:px-4 sm:m-2 md:p-3 md:px-4 md:m-2 lg:p-3 lg:px-4 lg:m-2 m-1 p-3 px-4 ">
              {isLoggedIn?
                  <>
                    <a id='create-room' style={{textDecoration:"none", color:"white"}} href="/roomJoin">Create Room</a>
                  </>
                :
                  <>
                    <a id='create-room' style={{textDecoration:"none", color:"white"}} href="/user/login" onClick={(event) => {
                      event.preventDefault();
                      toast.error("Please login first!!");
                      setTimeout(()=>{
                        window.location.href = "/user/login";
                      },400);
                    }}>Create Room</a>
                  </>
              }
              </button>
              <button className="bg-blue-600 w-[10rem] rounded-full btn btn-room sm:p-3 sm:px-4 sm:m-2 md:p-3 md:px-4 md:m-2 lg:p-3 lg:px-4 lg:m-2 m-1 p-3 px-4 ">
                {isLoggedIn?
                  <>
                    <a id='join-room' style={{textDecoration:"none",color:"white"}} href="/roomJoin">Join Room</a>
                  </>
                :
                  <>
                    <a id='join-room' style={{textDecoration:"none",color:"white"}} href="/user/login" onClick={(event) => {
                      event.preventDefault();
                      toast.error("Please login first!!");
                      setTimeout(()=>{
                        window.location.href = "/user/login";
                      },400);
                    }}>Join Room</a>
                  </>
                }
              </button>
            </div>
          </div>

          <div className="relative image md:w-[50%] lg:w-[50%] w-full flex justify-center items-center">
            <img className="w-[90%] max-w-full" src="/Images/code-editor-combined.png" alt="Code Editor Preview" />
          </div>

        </section>

        <section className="view-2 bg-slate-900 py-10 flex items-center justify-center overflow-hidden">
      {/* Marquee Container */}
      <div className="marquee-container relative w-[60%] overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

        {/* Marquee Wrapper */}
        <div ref={marqueeRef} className="marquee-wrapper py-0 px-10 flex items-center whitespace-nowrap space-x-10">
          {/* First Track */}
          <div className="marquee-track flex items-center space-x-10 flex-shrink-0">
            <img className="w-20" src="/Images/Icons/cpp.png" alt="C++" />
            <img className="w-20" src="/Images/Icons/php.png" alt="PHP" />
            <img className="w-20" src="/Images/Icons/python.png" alt="Python" />
            <img className="w-20" src="/Images/Icons/java.png" alt="Java" />
            <img className="w-20" src="/Images/Icons/ts.png" alt="TypeScript" />
            <img className="w-20" src="/Images/Icons/js.png" alt="JavaScript" />
          </div>

          {/* Second Track (Duplicate for seamless loop) */}
          <div className="marquee-track flex items-center space-x-10 flex-shrink-0">
            <img className="w-20" src="/Images/Icons/cpp.png" alt="C++" />
            <img className="w-20" src="/Images/Icons/php.png" alt="PHP" />
            <img className="w-20" src="/Images/Icons/python.png" alt="Python" />
            <img className="w-20" src="/Images/Icons/java.png" alt="Java" />
            <img className="w-20" src="/Images/Icons/ts.png" alt="TypeScript" />
            <img className="w-20" src="/Images/Icons/js.png" alt="JavaScript" />
          </div>
        </div>
      </div>
    </section>

        {/* Features Section */}
        <section id="features" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-8">Powerful Features for Seamless Collaboration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <Star className="mx-auto mb-4" size={32} />
                <h3 className="text-4xl font-bold mb-2">50,000+</h3>
                <p className="text-gray-200">Active Users</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <Users2 className="mx-auto mb-4" size={32} />
                <h3 className="text-4xl font-bold mb-2">100,000+</h3>
                <p className="text-gray-200">Code Sessions</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 text-center">
                <Code2 className="mx-auto mb-4" size={32} />
                <h3 className="text-4xl font-bold mb-2">30+</h3>
                <p className="text-gray-200">Languages Supported</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{testimonial.content}</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-full w-12 h-12"
                      />
                      <div className="ml-3">
                        <h5 className="font-semibold">{testimonial.name}</h5>
                        <small className="text-gray-500">{testimonial.role} at {testimonial.company}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo and Description */}
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <img src="/Images/CodeCollab.png" alt="CodeCollab Logo" className="w-48" />
                </div>
                <p className="text-gray-400">
                  Empowering developers to collaborate seamlessly and build amazing things together.
                </p>
              </div>
              {/* Quick Links */}
              <div>
                <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
                </ul>
              </div>
              {/* Legal Links */}
              <div>
                <h5 className="text-lg font-semibold mb-4">Legal</h5>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <hr className="my-8 border-gray-700" />
            <p className="text-center text-gray-400">
              © 2024 CodeSync. All rights reserved.
            </p>
          </div>
        </footer>


      </main>
    </>
  );
}

export default Home;
