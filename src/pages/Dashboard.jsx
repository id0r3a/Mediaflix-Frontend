import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './Welcome.css';
import './DashboardMenu.css';

function Dashboard() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    //states
    const [books, setBooks] = useState([]);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    // Hämta böcker och filmer
    useEffect(() => {
        fetch('https://localhost:7026/api/media')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(data => {
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

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // BOOK handlers
    const handleAddBook = () => navigate('/add-book');
    const handleReviewBook = () => navigate('/review');
    const handleSeeAllBooks = () => navigate('/all-books');
    const handleBooksIveRead = () => navigate('/books-ive-read');
    const handleBooksIWantToRead = () => navigate('/books-i-want-to-read');


    // MOVIE handlers (du kan lägga till dessa senare)
    const handleAddMovie = () => {
        navigate('/add-movie');
    };

    const handleReviewMovie = () => {
        navigate('/review-movie');
    };

    const handleSeeAllMovies = () => {
        navigate('/all-movies');
    };
    const handleMoviesWatched = () => {
    navigate('/movies-ive-watched');
    };

const handleMoviesWantToWatch = () => {
    navigate('/movies-want-to-watch');
};



    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="dashboard-container">
            <button className="logout-btn" onClick={logout}>Logout</button>

            <div className="welcome-container">
                <div className="overlay">
                    <h1>Choose Your Media</h1>

                    <div className="button-group">
                        {/* BOOKS block */}
                        <div className="menu-block">
                            <button className="main-btn" onClick={() => toggleMenu('books')}>
                                Books
                            </button>
                            {openMenu === 'books' && (
                                <div className="dropdown">
                                    <button onClick={handleAddBook}>Add Book</button>
                                    <button onClick={handleReviewBook}>Review Book</button>
                                    <button onClick={handleSeeAllBooks}>See All Books</button>
                                    <button onClick={handleBooksIveRead}>Books I've Read</button>
                                    <button onClick={handleBooksIWantToRead}>Books I Want to Read</button>
                                </div>
                            )}
                        </div>

                        {/* MOVIES block */}
                        <div className="menu-block">
                            <button className="main-btn" onClick={() => toggleMenu('movies')}>
                                Movies
                            </button>
                            {openMenu === 'movies' && (
                        <div className="dropdown">
                            <button onClick={handleAddMovie}>Add Movie</button>
                            <button onClick={handleReviewMovie}>Review Movie</button>
                            <button onClick={handleSeeAllMovies}>See All Movies</button>
                            <button onClick={handleMoviesWatched}>Movies I've Watched</button>
                            <button onClick={handleMoviesWantToWatch}>Movies I Want to Watch</button>
                        </div>
                        )}

                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
