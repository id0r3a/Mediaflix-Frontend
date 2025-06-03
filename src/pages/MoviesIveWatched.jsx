import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "../pages/MovieList.css";

function MoviesIveWatched() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
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
          if (!res.ok) throw new Error("Failed to fetch media");
          return res.json();
        })
        .then((data) => {
          const watched = data.filter(
            (item) =>
              item.type?.toLowerCase() === "movie" &&
              item.status?.toLowerCase() === "watched"
          );
          setWatchedMovies(watched);

          watched.forEach((movie) => {
            fetch(`${API_URL}/reviews/media/${movie.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setReviews((prev) => ({ ...prev, [movie.id]: data }));
              })
              .catch(() => {
                // Fel vid hämtning av recensioner ignoreras
              });
          });
        })
        .catch((err) => {
          console.error("Error fetching media:", err);
          setError("Failed to load watched movies.");
        });
    } catch (err) {
      console.error("JWT decode failed:", err);
      setError("Invalid token.");
    }
  }, [token]);

  const averageRating = (movieId) => {
    const revs = reviews[movieId];
    if (!revs || revs.length === 0) return null;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return (sum / revs.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
        {hasHalf && <span>⭐️</span>}
      </>
    );
  };

  return (
    <div className="movie-container">
      <h1 className="movie-title">🎬 Watched Movies</h1>

      {error && <p className="error-msg">{error}</p>}

      {watchedMovies.length === 0 && !error ? (
        <p className="no-movies-msg">No watched movies yet.</p>
      ) : (
        <table className="movie-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>Title</th>
              <th style={{ width: "10%" }}>Genre</th>
              <th style={{ width: "38%" }}>Description</th>
              <th style={{ width: "15%" }}>Director</th>
              <th style={{ width: "10%" }}>Rating</th>
              <th style={{ width: "15%" }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {watchedMovies.map((movie) => {
              const rating = averageRating(movie.id);
              const comments =
                reviews[movie.id]?.map((r) => r.comment).join(", ") || "No comments";

              return (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.description}</td>
                  <td>{movie.creator}</td>
                  <td>{rating ? renderStars(rating) : ""}</td>
                  <td>{comments}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MoviesIveWatched;
