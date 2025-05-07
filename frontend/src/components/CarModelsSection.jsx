import React from 'react';

const CarModelsSection = ({ cars, selectedCar, setSelectedCar, loading, error }) => {
  return (
    <div id="models" className="py-12 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Models</h2>
      <p className="text-xl text-center mb-8 font-extrabold text-gray-700">Our available rental fleet</p>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB5A3C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cars...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-xl">{error}</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl">No cars available at the moment.</p>
        </div>
      ) : (
        <>
          {/* Car Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {cars.map((car) => (
              <button
                key={car._id}
                onClick={() => setSelectedCar(car)}
                className={`px-6 py-3 rounded font-medium ${
                  selectedCar && selectedCar._id === car._id
                    ? "bg-[#EB5A3C] text-white" 
                    : "bg-white text-black border"
                }`}
              >
                {car.brand} {car.model}
              </button>
            ))}
          </div>
          
          {/* Car Display */}
          {selectedCar && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {/* Car Image */}
                <div className="w-full h-76 mb-4">
                  <img
                    src={selectedCar.image}
                    alt={`${selectedCar.brand} ${selectedCar.model}`}
                    className="w-full h-full object-contain"
                    loading='lazy'
                    onError={(e) => {
                      e.target.src = "/images/default-car.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl font-extrabold">R {selectedCar.pricePerDay.toFixed(2)}</h3>
                  <p className="text-gray-500 text-sm font-medium border-b pb-2">per day</p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="flex justify-between">
                    <span className="font-medium">Brand:</span>
                    <span className="font-medium">{selectedCar.brand}</span>
                  </p>
                  <p className="flex justify-between ">
                    <span className="font-medium">Model:</span>
                    <span className="font-medium">{selectedCar.model}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Year:</span>
                    <span className="font-medium">{selectedCar.year}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Transmission:</span>
                    <span className="font-medium">{selectedCar.transmission || "Manual"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Availability:</span>
                    <span className={selectedCar.available ? "text-green-600" : "text-red-600"}>
                      {selectedCar.available ? "Available" : "Booked"}
                    </span>
                  </p>
                </div> 
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CarModelsSection; 