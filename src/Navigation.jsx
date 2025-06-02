import { Link } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Navigation() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="navigation">
            <Link to="/" className="nav-link">Spellen</Link>
            <Link to="/about" className="nav-link">Over Ons</Link>
            <Link to="/user" className="nav-link">Gebruikers Spellen</Link>
            {auth.currentUser ? (
                <button onClick={handleLogout} className="nav-link logout-button">
                    Uitloggen
                </button>
            ) : (
                <Link to="/login" className="nav-link">Inloggen</Link>
            )}
        </nav>
    );
}

export default Navigation; 