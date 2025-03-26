import React from 'react';

const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-12 px-4 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">How it works</h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-[#EB5A3C]/10 rounded-md flex items-center justify-center mb-4">
            <img
              src="/images/car-icon-1.png"
              alt="Select Car"
              className="w-12 h-12"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48?text=🚗";
                e.target.onerror = null;
              }}
            />
          </div>
          <h3 className="text-xl font-bold mb-2">Select Car</h3>
          <p className="text-gray-600">Select your desired car <br /> for rental from our <br /> rental fleet.</p>
        </div>
        
        {/* Step 2 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-[#EB5A3C]/10 rounded-md flex items-center justify-center mb-4">
            <img
              src="/images/email.png"
              alt="Confirmation Email"
              className="w-12 h-12"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48?text=📧";
                e.target.onerror = null;
              }}
            />
          </div>
          <h3 className="text-xl font-bold mb-2">Confirmation Email</h3>
          <p className="text-gray-600">You will receive a <br /> confirmation email <br /> about your  rental details.</p>
        </div>
        
        {/* Step 3 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-[#EB5A3C]/10 rounded-md flex items-center justify-center mb-4">
            <img
              src="/images/car-key.png"
              alt="Get Driving"
              className="w-12 h-12"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48?text=🔑";
                e.target.onerror = null;
              }}
            />
          </div>
          <h3 className="text-xl font-bold mb-2">Get Driving</h3>
          <p className="text-gray-600">After payments and <br /> collections, you are ready to <br /> drive away.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection; 