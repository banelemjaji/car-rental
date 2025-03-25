import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center fixed w-full top-0 z-50">
      <button onClick={() => scrollToSection('home')} className="text-2xl font-bold text-black mr-12">
        Pinetown Rentals
      </button>
      <div className="space-x-8 flex-1">
        <button onClick={() => scrollToSection('home')} className="font-medium hover:text-[#EB5A3C] transition">
          Home
        </button>
        <button onClick={() => scrollToSection('cars')} className="font-medium hover:text-[#EB5A3C] transition">
          Cars
        </button>
        <button onClick={() => scrollToSection('how-it-works')} className="font-medium hover:text-[#EB5A3C] transition">
          How It Works
        </button>
        <button onClick={() => scrollToSection('about')} className="font-medium hover:text-[#EB5A3C] transition">
          About Us
        </button>
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
            <Link to="/login" className="font-medium hover:text-[#EB5A3C] transition">Sign In</Link>
            <Link to="/signup" className="bg-[#EB5A3C] text-white px-5 py-2 rounded font-medium hover:bg-[#d44a2e] transition">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
