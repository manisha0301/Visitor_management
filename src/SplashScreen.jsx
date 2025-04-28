import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "./assets/LOGO_KRISTELLAR_WHITE.png";

function SplashScreen() {
  const navigate = useNavigate();
  const [mainVisible, setMainVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [logoScale, setLogoScale] = useState(0.5);
  const [particles, setParticles] = useState([]);
  const [comets, setComets] = useState([]);
  const canvasRef = useRef(null);

  // Generate stars for background with different brightness levels
  useEffect(() => {
    const starCount = 120;
    const newParticles = Array.from({ length: starCount }, () => {
      const brightness = Math.random();
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: brightness * 3 + 1,
        opacity: brightness * 0.8 + 0.2,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 2
      };
    });
    setParticles(newParticles);

    // Generate comets
    const cometCount = 6;
    const newComets = Array.from({ length: cometCount }, () => ({
      startX: Math.random() * 120 - 10,
      startY: Math.random() * 20 - 10,
      length: Math.random() * 100 + 100,
      angle: Math.random() * 30 + 30,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 10,
      size: Math.random() * 2 + 1
    }));
    setComets(newComets);
  }, []);

  // Nebula canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particleArray = [];
    const numberOfParticles = 100;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.random() * 50 + 50}, ${Math.random() * 50 + 100}, ${Math.random() * 100 + 155}, ${Math.random() * 0.15 + 0.05})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    function init() {
      particleArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particleArray.push(new Particle());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Enhanced sequence of animations
    const sequence1 = setTimeout(() => setMainVisible(true), 300);
    const sequence2 = setTimeout(() => setLogoScale(1), 800);
    const sequence3 = setTimeout(() => setTextVisible(true), 1800);
    
    // Navigate after animations complete
    const navigationTimer = setTimeout(() => {
      setMainVisible(false);
      setTextVisible(false);
      setLogoScale(1.2);
      
      setTimeout(() => {
        navigate("/select");
      }, 800);
    }, 5500);

    return () => {
      clearTimeout(sequence1);
      clearTimeout(sequence2);
      clearTimeout(sequence3);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden relative">
      {/* Nebula background effect */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90 z-10"></div>
      
      {/* Animated stars */}
      {particles.map((particle, index) => (
        <div
          key={`star-${index}`}
          className="absolute rounded-full bg-white z-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, ${particle.opacity})`,
            animation: `twinkle ${particle.duration}s infinite ease-in-out ${particle.delay}s`
          }}
        />
      ))}
      
      {/* Animated comets */}
      {comets.map((comet, index) => (
        <div
          key={`comet-${index}`}
          className="absolute bg-gradient-to-r from-white to-transparent z-20"
          style={{
            left: `${comet.startX}%`,
            top: `${comet.startY}%`,
            width: `${comet.length}px`,
            height: `${comet.size}px`,
            transform: `rotate(${comet.angle}deg)`,
            opacity: 0,
            animation: `comet ${comet.duration}s infinite ease-out ${comet.delay}s`,
            borderRadius: '100px'
          }}
        />
      ))}

      <div
        className="relative text-center transition-all duration-1000 ease-out z-30"
        style={{
          opacity: mainVisible ? 1 : 0,
          transform: `scale(${logoScale})`,
        }}
      >
        {/* Logo with enhanced effects */}
        <div className="flex justify-center relative mb-12">
          {/* Outer glow */}
          <div className="absolute w-64 h-64 rounded-full bg-blue-400/20 animate-pulse"></div>
          
          {/* Main logo container */}
          <div className="w-60 h-60 rounded-full bg-gradient-to-br from-blue-600/90 to-indigo-800/90 flex items-center justify-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Inner light effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-400/30 to-indigo-300/30"></div>
            
            {/* Logo image */}
            <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-blue-600/80 to-indigo-700/80 flex items-center justify-center text-white text-4xl font-bold relative z-10">
              <img 
                src={image1} 
                alt="Kristellar Logo" 
                className="w-40 h-24 drop-shadow-lg" 
                style={{ filter: "drop-shadow(0 0 8px rgba(147, 197, 253, 0.6))" }}
              />
            </div>
          </div>
          
          {/* Orbiting elements with glows */}
          <div className="absolute w-full h-full">
            {/* First orbiting element */}
            <div 
              className="absolute w-5 h-5 bg-blue-200 rounded-full"
              style={{ 
                animation: "orbit 6s linear infinite",
                boxShadow: "0 0 15px 5px rgba(147, 197, 253, 0.6)",
                left: "calc(50% - 2.5px)",
                top: "-10px"
              }}
            ></div>
            
            {/* Second orbiting element */}
            <div 
              className="absolute w-4 h-4 bg-indigo-300 rounded-full"
              style={{ 
                animation: "orbit 8s linear infinite 2s",
                boxShadow: "0 0 15px 5px rgba(165, 180, 252, 0.6)",
                left: "calc(50% - 2px)",
                top: "-8px"
              }}
            ></div>
            
            {/* Third orbiting element */}
            <div 
              className="absolute w-3 h-3 bg-purple-200 rounded-full"
              style={{ 
                animation: "orbit 10s linear infinite 1s",
                boxShadow: "0 0 10px 3px rgba(216, 180, 254, 0.6)",
                left: "calc(50% - 1.5px)",
                top: "-6px"
              }}
            ></div>
          </div>
          
          {/* Pulsing rings */}
          <div className="absolute inset-0 w-full h-full">
            <div 
              className="absolute inset-0 rounded-full border-2 border-blue-300/40"
              style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
            ></div>
            <div 
              className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
              style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s" }}
            ></div>
          </div>
        </div>

        {/* Text with enhanced typing effect */}
        <div 
          className="overflow-hidden transition-all duration-1000"
          style={{ opacity: textVisible ? 1 : 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200 mb-3 drop-shadow-md">
            Welcome to
          </h1>
          <div className="h-14 overflow-hidden">
            <h2 
              className="text-2xl md:text-3xl font-bold text-blue-200 drop-shadow-lg"
              style={{ 
                animation: textVisible ? "typing 2.5s steps(30, end), blink-caret 0.75s step-end infinite" : "none",
                borderRight: textVisible ? "3px solid rgba(147, 197, 253, 0.8)" : "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                margin: "0 auto",
                display: "inline-block"
              }}
            >
              Kristellar Aerospace Pvt. Ltd.
            </h2>
          </div>
        </div>
      </div>

      {/* Enhanced animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }
          
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: rgba(147, 197, 253, 0.8) }
          }
          
          @keyframes comet {
            0% { transform: translateX(0) translateY(0) rotate(${Math.random() * 30 + 30}deg); opacity: 0; }
            10% { opacity: 0.8; }
            30% { opacity: 0.2; }
            100% { transform: translateX(-120vw) translateY(100vh) rotate(${Math.random() * 30 + 30}deg); opacity: 0; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default SplashScreen;