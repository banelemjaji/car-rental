import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Form states
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

  // Dropdown visibility states
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

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Find the selected car to get its image
    const selectedCar = cars.find(car => `${car.brand} ${car.model}` === carType);
    
    // Create booking details
    const details = {
      carType,
      carImage: selectedCar?.image || '/default-car.jpg', // Add car image
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

  return {
    // Form states
    carType,
    setCarType,
    pickupLocation,
    setPickupLocation,
    dropoffLocation,
    setDropoffLocation,
    pickupDate,
    setPickupDate,
    pickupTime,
    setPickupTime,
    dropoffDate,
    setDropoffDate,
    dropoffTime,
    setDropoffTime,

    // Car data states
    cars,
    selectedCar,
    setSelectedCar,
    loading,
    error,

    // Booking modal states
    showBookingModal,
    setShowBookingModal,
    bookingDetails,

    // Location data
    locations,

    // Dropdown states
    showCarDropdown,
    setShowCarDropdown,
    showPickupDropdown,
    setShowPickupDropdown,
    showDropoffDropdown,
    setShowDropoffDropdown,

    // Authentication
    isAuthenticated,

    // Handlers
    handleSearch,
    handleConfirmBooking,
    handleRentCar
  };
}; 