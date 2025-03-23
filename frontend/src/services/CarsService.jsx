const BASE_URL = "http://localhost:5001/api/cars"; // Update with your backend port if different

export const fetchCars = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }
  return response.json();
};

export const getCarById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch car by ID");
  }
  return response.json();
};
