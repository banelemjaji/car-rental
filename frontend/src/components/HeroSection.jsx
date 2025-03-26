import React from 'react';

const HeroSection = ({ isAuthenticated, handleRentCar }) => {
  return (
    <div id="home" className="relative flex flex-col md:flex-row justify-between items-center py-16 px-8">
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <p className="text-lg font-medium text-gray-700">Plan your trip now</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-4 tracking-tight">Rent The Perfect Car</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">From <span className="text-[#EB5A3C] font-extrabold">ONLY R 500.00!</span></h2>
        <button 
          onClick={handleRentCar}
          className="bg-[#EB5A3C] text-white px-7 py-3 rounded font-medium text-lg inline-block hover:bg-[#d44a2e] transition"
        >
          {isAuthenticated ? "Rent Car" : "Rent Now"}
        </button>
      </div>
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full h-64 md:h-80 relative">
          <img 
            src="/images/cars2.jpg" 
            alt="Car Fleet" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x300?text=Car+Fleet";
              e.target.onerror = null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 