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

  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Location suggestions
  const locations = [
    "Durban - Pinetown Centre",
    "Durban - Gateway Mall",
    "Durban - Musgrave Centre",
    "Durban - Pavilion Mall",
    "Durban - Umhlanga Rocks",
    "Durban - Westville Mall",
    "Durban - Chatsworth Centre",
    "Durban - Phoenix Plaza"
  ];

  // Filtered suggestions
  const [carSuggestions, setCarSuggestions] = useState([]);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // Add new state for dropdown visibility
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

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

  // Handle input changes for autocomplete
  const handleCarTypeChange = (e) => {
    const value = e.target.value;
    setCarType(value);
    if (value) {
      const filtered = cars
        .filter(car => 
          `${car.brand} ${car.model}`.toLowerCase().includes(value.toLowerCase())
        )
        .map(car => `${car.brand} ${car.model}`);
      setCarSuggestions(filtered);
    } else {
      setCarSuggestions([]);
    }
  };

  const handlePickupLocationChange = (e) => {
    const value = e.target.value;
    setPickupLocation(value);
    if (value) {
      const filtered = locations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setPickupSuggestions(filtered);
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDropoffLocationChange = (e) => {
    const value = e.target.value;
    setDropoffLocation(value);
    if (value) {
      const filtered = locations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setDropoffSuggestions(filtered);
    } else {
      setDropoffSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create booking details
    const details = {
      carType,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      totalDays: calculateTotalDays(),
      estimatedPrice: calculateEstimatedPrice()
    };

    setBookingDetails(details);
    setShowBookingModal(true);
  };

  const calculateTotalDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateEstimatedPrice = () => {
    const days = calculateTotalDays();
    const selectedCarData = cars.find(car => `${car.brand} ${car.model}` === carType);
    return days * (selectedCarData?.pricePerDay || 0);
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      setShowBookingModal(false);
      navigate('/signup');
    } else {
      // Handle actual booking logic here
      console.log("Booking confirmed:", bookingDetails);
      setShowBookingModal(false);
    }
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
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select Car Type</label>
              <input
                type="text"
                placeholder="Select a car"
                className="w-full p-3 border rounded cursor-pointer"
                value={carType}
                onClick={() => setShowCarDropdown(true)}
                readOnly
              />
              {showCarDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {cars.map((car) => (
                    <div
                      key={car._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCarType(`${car.brand} ${car.model}`);
                        setShowCarDropdown(false);
                      }}
                    >
                      {car.brand} {car.model}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Location</label>
              <input
                type="text"
                placeholder="Select pickup location"
                className="w-full p-3 border rounded cursor-pointer"
                value={pickupLocation}
                onClick={() => setShowPickupDropdown(true)}
                readOnly
              />
              {showPickupDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setPickupLocation(location);
                        setShowPickupDropdown(false);
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Location</label>
              <input
                type="text"
                placeholder="Select drop-off location"
                className="w-full p-3 border rounded cursor-pointer"
                value={dropoffLocation}
                onClick={() => setShowDropoffDropdown(true)}
                readOnly
              />
              {showDropoffDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDropoffLocation(location);
                        setShowDropoffDropdown(false);
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
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

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Booking Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Car Type:</p>
                <p>{bookingDetails.carType}</p>
              </div>
              <div>
                <p className="font-medium">Pick-up Location:</p>
                <p>{bookingDetails.pickupLocation}</p>
              </div>
              <div>
                <p className="font-medium">Drop-off Location:</p>
                <p>{bookingDetails.dropoffLocation}</p>
              </div>
              <div>
                <p className="font-medium">Pick-up Date & Time:</p>
                <p>{bookingDetails.pickupDate} at {bookingDetails.pickupTime}</p>
              </div>
              <div>
                <p className="font-medium">Drop-off Date & Time:</p>
                <p>{bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</p>
              </div>
              <div>
                <p className="font-medium">Total Days:</p>
                <p>{bookingDetails.totalDays} days</p>
              </div>
              <div>
                <p className="font-medium">Estimated Price:</p>
                <p className="text-[#EB5A3C] font-bold">R {bookingDetails.estimatedPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-[#EB5A3C] text-white rounded hover:bg-[#d44a2e] transition"
              >
                {isAuthenticated ? "Confirm Booking" : "Sign Up to Book"}
              </button>
            </div>
          </div>
        </div>
      )}

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
      </div>
    );
  };
  
  export default Home;
  