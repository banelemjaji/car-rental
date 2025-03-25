import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [carType, setCarType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  
  // Car data states
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        console.log("Cars from API:", response.data);
        
        if (response.data?.data && response.data.data.length > 0) {
          setCars(response.data.data);
          setSelectedCar(response.data.data[0]); // Select first car by default
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars");
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Search submitted");
  };

  const handleRentCar = () => {
    if (!isAuthenticated) {
      navigate('/signup');
    } else {
      // If authenticated, scroll to cars section
      const carsSection = document.getElementById('cars');
      if (carsSection) {
        carsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
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
          {/* Hero image */}
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

      {/* Booking Section */}
      <div className="py-12 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-tight">Book Here</h2>
        <form onSubmit={handleSearch} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select Car Type</label>
              <input
                type="text"
                placeholder="Renault"
                className="w-full p-3 border rounded"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Location</label>
              <input
                type="text"
                placeholder="Durban - Pinetown Centre"
                className="w-full p-3 border rounded"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Location</label>
              <input
                type="text"
                placeholder="85 Curry's Post"
                className="w-full p-3 border rounded"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div>
              <input
                type="time"
                className="w-full p-3 border rounded"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
              />
            </div>
            <div>
              <input
                type="time"
                className="w-full p-3 border rounded"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
              />
            </div>
            <div className="lg:col-span-5 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#EB5A3C] text-white px-10 py-3 rounded font-medium text-lg hover:bg-[#d44a2e] transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Models Section */}
      <div id="cars" className="py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Models</h2>
        <p className="text-xl text-center mb-8 font-extrabold text-gray-700">Our available rental fleet</p>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl">Loading available cars...</p>
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
                        {selectedCar.available ? "Available" : "Unavailable"}
                      </span>
                    </p>
                  </div>
                  
                  <button 
                    className={`py-3 px-6 rounded font-medium text-lg ${
                      selectedCar.available 
                        ? "bg-[#EB5A3C] text-white hover:bg-[#d44a2e]" 
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    } transition`}
                    disabled={!selectedCar.available}
                  >
                    {selectedCar.available ? "Rent Now" : "Not Available"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* How It Works Section */}
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

      {/* About Us Section */}
      <div id="about" className="py-12 px-4 bg-gray-50">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
  