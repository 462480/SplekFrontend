import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';
import AboutPage from './AboutPage';
import Navigation from './Navigation';
import UserGamesPage from './UserGamesPage';
import LoginPage from './LoginPage';

// Protected Route component
function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Laden...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

function GamesPage() {
    const [games, setGames] = useState();
    const [newGame, setNewGame] = useState({
        title: '',
        body: ''
    });

    useEffect(() => {
        populateGames();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGame(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting new game:', newGame);
        console.log('0---------------------------0');
        console.log(JSON.stringify({
            title: newGame.title,
            body: newGame.body,
            userId: 0
        }))
        try {
            const response = await fetch('https://splektotalwebapp-b0hrd9hqdffdetfj.westeurope-01.azurewebsites.net/api/Game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newGame.title,
                    body: newGame.body,
                    userId: 1 
                })
            });

            if (response.ok) {
                setNewGame({ title: '', body: '' });
                populateGames();
            } else {
                console.error('Spel toevoegen mislukt');
            }
        } catch (error) {
            console.error('Error adding game:', error);
        }
    };

    const contents = games === undefined
        ? <p><em>Loading...</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>👤 Gebruikers ID</th>
                    <th>🎮 Naam</th>
                    <th>💭 Slogan</th>
                    <th>📝 Beschrijving</th>
                </tr>
            </thead>
            <tbody>
                {games.map(game => {
                    const [name, catchphrase] = game.title.split('-').map(part => part.trim());
                    return (
                        <tr key={game.id}>
                            <td>{game.id}</td>
                            <td>{name}</td>
                            <td>{catchphrase}</td>
                            <td>{game.body}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>;

    async function populateGames() {
        const response = await fetch('https://splektotalwebapp-b0hrd9hqdffdetfj.westeurope-01.azurewebsites.net/api/game');
        if (response.ok) {
            const data = await response.json();
            setGames(data);
        }
    }

    return (
        <div>
            <h1 id="tableLabel">Alle Spellen</h1>
            <p>Hier vind je alle spellen in de database.</p>
            
            <div className="add-game-form">
                <h2>Nieuw Spel Toevoegen</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            value={newGame.title}
                            onChange={handleInputChange}
                            placeholder="Game Title"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="body"
                            value={newGame.body}
                            onChange={handleInputChange}
                            placeholder="Game Description"
                            className="form-input"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Spel Toevoegen</button>
                </form>
            </div>

            {contents}
        </div>
    );
}

function App() {
    return (
        <div>
            <Navigation />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/user" element={<UserGamesPage />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <GamesPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

export default App;