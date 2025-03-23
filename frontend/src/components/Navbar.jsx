import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center">
      <Link to="/" className="text-2xl font-bold text-black mr-12">Pinetown Rentals</Link>
      <div className="space-x-8 flex-1">
        <Link to="/" className="font-medium hover:text-orange-500 transition">Home</Link>
        <Link to="/cars" className="font-medium hover:text-orange-500 transition">Cars</Link>
        <Link to="/about" className="font-medium hover:text-orange-500 transition">About Us</Link>
        <Link to="/contact" className="font-medium hover:text-orange-500 transition">Contact</Link>
      </div>
      <div className="space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700 font-medium">Hello, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="font-medium hover:text-orange-500 transition">Sign In</Link>
            <Link to="/signup" className="bg-orange-500 text-white px-5 py-2 rounded font-medium hover:bg-orange-600 transition">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
