import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./Welcome.css";
import "./DashboardMenu.css";

function Dashboard() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );

      fetch(`${API_URL}/api/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          const booksData = data.filter(
            (item) => item.type === "Book" && item.userId === userId
          );
          const moviesData = data.filter(
            (item) => item.type === "Movie" && item.userId === userId
          );

          setBooks(booksData);
          setMovies(moviesData);
        })
        .catch((err) => {
          console.error("Fel vid hämtning av media:", err);
          setError("Kunde inte hämta data.");
        });
    } catch (err) {
      console.error("JWT decode error:", err);
      setError("Invalid token.");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddBook = () => navigate("/add-book");
  const handleReviewBook = () => navigate("/review");
  const handleSeeAllBooks = () => navigate("/all-books");
  const handleBooksIveRead = () => navigate("/books-ive-read");
  const handleBooksIWantToRead = () => navigate("/books-want-to-read");

  const handleAddMovie = () => navigate("/add-movie");
  const handleReviewMovie = () => navigate("/review-movie");
  const handleSeeAllMovies = () => navigate("/all-movies");
  const handleMoviesWatched = () => navigate("/movies-ive-watched");
  const handleMoviesWantToWatch = () => navigate("/movies-want-to-watch");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="dashboard-container">
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

      <div className="welcome-container">
        <div className="overlay">
          <h1>Choose Your Media</h1>

          <div className="button-group">
            <div className="menu-block">
              <button
                className="main-btn"
                onClick={() => toggleMenu("books")}
              >
                Books
              </button>
              {openMenu === "books" && (
                <div className="dropdown">
                  <button onClick={handleAddBook}>Add Book</button>
                  <button onClick={handleReviewBook}>Review Book</button>
                  <button onClick={handleSeeAllBooks}>See All Books</button>
                  <button onClick={handleBooksIveRead}>Books I've Read</button>
                  <button onClick={handleBooksIWantToRead}>
                    Books I Want to Read
                  </button>
                </div>
              )}
            </div>

            <div className="menu-block">
              <button
                className="main-btn"
                onClick={() => toggleMenu("movies")}
              >
                Movies
              </button>
              {openMenu === "movies" && (
                <div className="dropdown">
                  <button onClick={handleAddMovie}>Add Movie</button>
                  <button onClick={handleReviewMovie}>Review Movie</button>
                  <button onClick={handleSeeAllMovies}>See All Movies</button>
                  <button onClick={handleMoviesWatched}>
                    Movies I've Watched
                  </button>
                  <button onClick={handleMoviesWantToWatch}>
                    Movies I Want to Watch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bok- och filmvisning (enkel översikt) */}
          <div className="media-list">
            <h1>Books</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {books.length > 0 ? (
              books.map((book) => (
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
              movies.map((movie) => (
                <div key={movie.id}>
                  <h2>{movie.title}</h2>
                  <p>{movie.description}</p>
                </div>
              ))
            ) : (
              <p>Inga filmer hittades.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
