/**
 * Utility functions for handling API errors
 */

/**
 * Extract a user-friendly error message from an API error
 * @param {Error} error - The error object from axios
 * @returns {string} A user-friendly error message
 */
export const getErrorMessage = (error) => {
  // Network errors (no response)
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // Get error message from response if available
  const serverMessage = error.response?.data?.message;
  
  // Handle different status codes
  switch (error.response.status) {
    case 400:
      return serverMessage || "Invalid request. Please check your information and try again.";
    case 401:
      return "You need to log in to access this feature.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return serverMessage || "The requested resource was not found.";
    case 409:
      return serverMessage || "This action conflicts with the current state.";
    case 422:
      return serverMessage || "The provided data is invalid.";
    case 500:
      return "Something went wrong on our server. Please try again later.";
    default:
      return serverMessage || "An unexpected error occurred. Please try again.";
  }
};

/**
 * Log error details to console for debugging
 * @param {Error} error - The error object
 * @param {string} source - Where the error occurred
 */
export const logError = (error, source) => {
  console.error(`Error in ${source}:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  });
}; 