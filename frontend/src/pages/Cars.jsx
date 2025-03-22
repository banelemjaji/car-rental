import { useState, useEffect } from "react";
import axios from "axios";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("/api/cars");
        console.log("API response:", response);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Our Car Fleet</h1>
        <p className="mt-4 text-lg">Browse and rent from our wide selection of vehicles.</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl">Loading cars...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-xl">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.length === 0 ? (
            <p className="text-center col-span-full py-10">No cars available at the moment.</p>
          ) : (
            cars.map((car) => (
              <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/images/default-car.jpg";
                  }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
                  <p className="text-gray-600">Year: {car.year}</p>
                  <p className="font-bold text-lg mt-2">R{car.pricePerDay}/day</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-sm ${car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {car.available ? 'Available' : 'Unavailable'}
                    </span>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      disabled={!car.available}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Cars;
  