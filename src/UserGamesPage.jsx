import { useState } from 'react';

function UserGamesPage() {
    const [games, setGames] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`https://splektotalwebapp-b0hrd9hqdffdetfj.westeurope-01.azurewebsites.net/api/game/by-user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setGames(Array.isArray(data) ? data : [data]); // Handle both single game and array responses
            } else {
                setError('No games found for this ID');
                setGames([]);
            }
        } catch (err) {
            setError('Error fetching games');
            setGames([]);
        } finally {
            setLoading(false);
        }
    };

    const contents = loading ? (
        <p><em>Loading...</em></p>
    ) : (
        <div>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter ID"
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {games.length > 0 ? (
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>👤 User ID</th>
                            <th>🎮 Name</th>
                            <th>💭 Catchphrase</th>
                            <th>📝 Body</th>
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
                </table>
            ) : !error && <p>No games found. Enter an ID to search.</p>}
        </div>
    );

    return (
        <div>
            <h1 id="tableLabel">Search Games by ID</h1>
            <p>Enter an ID to find specific games</p>
            {contents}
        </div>
    );
}

export default UserGamesPage; 