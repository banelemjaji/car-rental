import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Cars from "./pages/Cars.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Bookings from "./pages/Bookings.jsx";
import BookCar from "./pages/BookCar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Axios response interceptor setup component
const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Add a response interceptor to handle auth errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Handle token expiration
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          const errorMsg = error.response?.data?.message || '';
          
          if (errorMsg.includes('expired') || errorMsg.includes('invalid token')) {
            // Clear auth state
            logout();
            
            // Redirect to login with message
            const currentPath = window.location.pathname;
            navigate('/login', { 
              state: { 
                authError: 'Your session has expired. Please log in again.',
                returnUrl: currentPath 
              }
            });
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, logout]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AxiosInterceptor />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes for authenticated users */}
            <Route 
              path="/cars" 
              element={
                <Cars />
              } 
            />
            <Route 
              path="/book-car" 
              element={
                <ProtectedRoute>
                  <BookCar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />

            {/* Legacy routes that will likely be accessed via home page scrolling */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
