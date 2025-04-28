import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SelectionScreen() {
  const navigate = useNavigate();
  const [hoverVisitor, setHoverVisitor] = useState(false);
  const [hoverCourier, setHoverCourier] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [logoScale, setLogoScale] = useState(0.5);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
      const newParticles = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 3 + 2
      }));
      setParticles(newParticles);
    }, []);

    useEffect(() => {
        // Sequence of animations
        const sequence1 = setTimeout(() => setMainVisible(true), 300);
        const sequence2 = setTimeout(() => setLogoScale(1), 600);
        const sequence3 = setTimeout(() => setTextVisible(true), 1200);
        
        // Navigate after animations complete
        const navigationTimer = setTimeout(() => {
          setMainVisible(false);
          setTextVisible(false);
          setLogoScale(1.2);
          
          setTimeout(() => {
            navigate("/select");
          }, 800);
        }, );
        // }, 20000);
    
        return () => {
          clearTimeout(sequence1);
          clearTimeout(sequence2);
          clearTimeout(sequence3);
          clearTimeout(navigationTimer);
        };
      }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-40 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div> */}

      {/* Animated particles/stars */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white opacity-80"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `twinkle ${particle.duration}s infinite ease-in-out`,
          }}
        />
      ))}

      <div
        className="relative text-center transition-all duration-1000 ease-out"
        style={{
          opacity: mainVisible ? 1 : 0,
          transform: `scale(${logoScale})`,
        }}
      >

      {/* Main content */}
      <div className="relative z-10 max-w-lg w-full bg-white/80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white border-opacity-20">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-10 mb-4">
          Visitor Management System
        </h1>
        
        <div className="space-y-6 mt-8">
          <button
            onClick={() => navigate("/visitor")}
            onMouseEnter={() => setHoverVisitor(true)}
            onMouseLeave={() => setHoverVisitor(false)}
            className={`w-full flex items-center justify-between px-6 py-5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              hoverVisitor 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white transform -translate-y-1 shadow-xl" 
                : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                hoverVisitor ? "bg-white bg-opacity-20" : "bg-blue-200"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${hoverVisitor ? "text-blue-600" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Visitor Registration</p>
                <p className={`text-sm ${hoverVisitor ? "text-blue-100" : "text-blue-500"}`}>For guests and visitors</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${hoverVisitor ? "text-white" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={() => navigate("/courier")}
            onMouseEnter={() => setHoverCourier(true)}
            onMouseLeave={() => setHoverCourier(false)}
            className={`w-full flex items-center justify-between px-6 py-5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              hoverCourier 
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white transform -translate-y-1 shadow-xl" 
                : "bg-gradient-to-r from-green-50 to-green-100 text-green-600 border border-green-200"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                hoverCourier ? "bg-white bg-opacity-20" : "bg-green-200"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${hoverCourier ? "text-green-600" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Courier Registration</p>
                <p className={`text-sm ${hoverCourier ? "text-green-100" : "text-green-500"}`}>For delivery personnel</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${hoverCourier ? "text-white" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        
      </div>
      
      <div className="text-center mt-6 text-sm text-indigo-900 opacity-70 relative z-10">
        © 2025 Your Company • <span className="hover:underline cursor-pointer">Privacy Policy</span> • <span className="hover:underline cursor-pointer">Terms</span>
      </div>
      </div>
    </div>
  );
}

export default SelectionScreen;