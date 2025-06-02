import { signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Check for redirect result when component mounts
    useEffect(() => {
        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    navigate('/');
                }
            } catch (error) {
                console.error("Redirect result error:", error);
                setError('Inloggen mislukt. Probeer het opnieuw.');
            }
        };
        checkRedirectResult();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        
        try {
            await signInWithRedirect(auth, provider);
            // The page will redirect to Google's login page
        } catch (error) {
            console.error("Login failed:", error);
            setError('Inloggen mislukt. Probeer het opnieuw.');
        }
    };

    return (
        <div className="login-container">
            <h1>Welkom bij Splek</h1>
            <p>Log in om toegang te krijgen tot alle functies</p>
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleGoogleLogin} className="login-button">
                Inloggen met Google
            </button>
        </div>
    );
}

export default LoginPage; 