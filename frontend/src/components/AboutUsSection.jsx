import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsSection = () => {
  return (
    <div className="py-12 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">About Us</h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          {/* About Us Image Placeholder */}
          <div className="w-full h-80 bg-gray-200 rounded">
            <img
              src="/images/about-us.png"
              alt="Car rental"
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400?text=About+Us+Image";
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-4">Your Journey, Our Priority - Rent with Confidence!</h3>
          <p className="text-gray-700 mb-4 font-medium">
            At Pinetown Rentals, we're passionate <br/> about making car rentals simple, <br /> affordable and hassle-free.
          </p>
          <Link to="/about" className="text-orange-500 font-semibold hover:underline">
            Learn more about us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection; 