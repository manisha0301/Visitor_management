// Analog Clock Component
const AnalogClock = () => {
  const date = new Date(); // Use current time directly
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Calculate angles for each hand (0 degrees is at 12 o'clock)
  const secondAngle = (seconds * 6); // 6 degrees per second
  const minuteAngle = (minutes * 6 + seconds * 0.1); // 6 degrees per minute
  const hourAngle = (hours * 30 + minutes * 0.5); // 30 degrees per hour
  
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm">
        {/* Hour markers */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30) - 90;
          return (
            <div
              key={i}
              className="absolute w-0.5 h-3 bg-white/50"
              style={{
                left: '50%',
                top: '10%',
                transformOrigin: 'center bottom',
                transform: `translateX(-50%) rotate(${angle}deg)`
              }}
            />
          );
        })}
        
        {/* Hour hand */}
        <div
          className="absolute w-1 bg-white rounded-full origin-bottom"
          style={{
            left: '50%',
            bottom: '50%',
            height: '25%',
            transformOrigin: 'center bottom',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`
          }}
        />
        
        {/* Minute hand */}
        <div
          className="absolute w-0.5 bg-white rounded-full origin-bottom"
          style={{
            left: '50%',
            bottom: '50%',
            height: '35%',
            transformOrigin: 'center bottom',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`
          }}
        />
        
        {/* Second hand */}
        <div
          className="absolute w-px bg-red-500 rounded-full origin-bottom transition-transform duration-75"
          style={{
            left: '50%',
            bottom: '50%',
            height: '38%',
            transformOrigin: 'center bottom',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`
          }}
        />
        
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default AnalogClock;