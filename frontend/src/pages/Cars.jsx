import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        setCars(response.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message || "Failed to fetch cars");
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleRentClick = (car) => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      setSelectedCar(car);
      setShowRentModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowRentModal(false);
    setSelectedCar(null);
  };

  const handleConfirmRent = () => {
    if (selectedCar) {
      navigate('/book', { state: { car: selectedCar } });
    }
  };

    return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Available Cars</h1>
          <p className="mt-4 text-lg text-gray-600">Choose from our selection of vehicles for your next journey.</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB5A3C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No cars available at the moment.</p>
              </div>
            ) : (
              cars.map((car) => (
                <div key={car._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/images/default-car.jpg";
                        e.target.onerror = null;
                      }}
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      car.available 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {car.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{car.brand} {car.model}</h2>
                        <p className="text-gray-500">{car.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#EB5A3C]">R{car.pricePerDay}</p>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{car.brand}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{car.model}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{car.year}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-medium">{car.seats || "5"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Doors:</span>
                        <span className="font-medium">{car.doors || "4"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Luggage Capacity:</span>
                        <span className="font-medium">{car.luggageCapacity || "3"} bags</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button 
                        onClick={() => handleRentClick(car)}
                        disabled={!car.available}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          car.available
                            ? "bg-[#EB5A3C] text-white hover:bg-[#d44a2e]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {car.available ? "Rent Now" : "Currently Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rent Modal */}
        {showRentModal && selectedCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
              <div className="relative">
                <img
                  src={selectedCar.image}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="w-full h-64 object-contain bg-gray-100 p-4"
                />
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedCar.brand} {selectedCar.model}
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{selectedCar.brand}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{selectedCar.model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{selectedCar.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transmission:</span>
                    <span className="font-medium">{selectedCar.transmission}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{selectedCar.seats || "5"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Doors:</span>
                    <span className="font-medium">{selectedCar.doors || "4"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Luggage Capacity:</span>
                    <span className="font-medium">{selectedCar.luggageCapacity || "3"} bags</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per Day:</span>
                    <span className="font-medium text-[#EB5A3C]">R{selectedCar.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`font-medium ${
                      selectedCar.available ? "text-green-600" : "text-red-600"
                    }`}>
                      {selectedCar.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRent}
                    className="px-6 py-2 bg-[#EB5A3C] text-white rounded-lg hover:bg-[#d44a2e] transition-colors"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  };
  
  export default Cars;
  