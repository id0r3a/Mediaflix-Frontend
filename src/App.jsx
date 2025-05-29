import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [books, setBooks] = useState([]);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://localhost:7026/api/media')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(data => {
                // Sortera upp i books och movies baserat på type
                const booksData = data.filter(item => item.type === 'Book');
                const moviesData = data.filter(item => item.type === 'Movie');

                setBooks(booksData);
                setMovies(moviesData);
            })
            .catch(error => {
                console.error('Fel vid hämtning av media:', error);
                setError('Kunde inte hämta data.');
            });
    }, []);

    return (
        <div>
            <h1>Books</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {books.length > 0 ? (
                books.map(book => (
                    <div key={book.id}>
                        <h2>{book.title}</h2>
                        <p>{book.description}</p>
                    </div>
                ))
            ) : (
                <p>Inga böcker hittades.</p>
            )}

            <h1>Movies</h1>
            {movies.length > 0 ? (
                movies.map(movie => (
                    <div key={movie.id}>
                        <h2>{movie.title}</h2>
                        <p>{movie.description}</p>
                    </div>
                ))
            ) : (
                <p>Inga filmer hittades.</p>
            )}
        </div>
    );
}

export default App;
