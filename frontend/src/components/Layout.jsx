import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import HomeNavbar from './HomeNavbar.jsx';
import AuthNavbar from './AuthNavbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Don't show navbar on auth pages
    const renderNavbar = () => {
        if (isAuthPage) {
            return null;
        }
        return isAuthenticated ? <AuthNavbar /> : <HomeNavbar />;
    };

    return (
        <div className='flex flex-col min-h-screen'>
            {renderNavbar()}
            <main className='flex-1'>{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;