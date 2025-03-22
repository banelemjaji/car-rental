import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-black">Pinetown Rentals</Link>
      <div className="space-x-6">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <Link to="/cars" className="hover:text-orange-500">Cars</Link>
        <Link to="/about" className="hover:text-orange-500">About Us</Link>
        <Link to="/contact" className="hover:text-orange-500">Contact</Link>
      </div>
      <div className="space-x-4">
        <Link to="/login" className="hover:text-orange-500">Sign In</Link>
        <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
