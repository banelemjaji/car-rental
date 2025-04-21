const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "/api"}/cars`;

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
