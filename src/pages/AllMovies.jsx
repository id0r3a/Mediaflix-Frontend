import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "../pages/AllMovies.css";
import HomeButton from "../components/HomeButton";

function AllMovies() {
  const [userId, setUserId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [addedMovies, setAddedMovies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const uid = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      setUserId(uid);

      fetch(`${API_URL}/api/media`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const allMovies = data.filter((m) => m.type === "Movie");
          setMovies(allMovies);

          allMovies.forEach((movie) => {
            fetch(`${API_URL}/api/reviews/media/${movie.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => {
                if (res.status === 204 || res.status === 404) return [];
                return res.text().then(text => text ? JSON.parse(text) : []);
              })
              .then((data) => {
                setReviews((prev) => ({ ...prev, [movie.id]: data }));
              })
              .catch((err) => {
                console.error(`Failed to load reviews for movie ${movie.id}`, err);
              });
          });
        })
        .catch(() => setError("Failed to load movies."));
    } catch {
      setError("Invalid token.");
    }
  }, [token]);

  const handleAddToWatchlist = async (movie) => {
    if (!userId || !token) return;

    const payload = {
      Title: movie.title,
      Genre: movie.genre,
      Description: movie.description,
      Creator: movie.creator,
      Type: "Movie",
      Status: "WantToWatch",
      UserId: userId,
    };

    try {
      const res = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAddedMovies((prev) => [...prev, movie.id]);
      } else {
        const msg = await res.text();
        alert("Failed to add: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const averageRating = (movieId) => {
    const revs = reviews[movieId];
    if (!revs || revs.length === 0) return null;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return (sum / revs.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <>
        {Array.from({ length: full }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
        {half && <span>⭐️</span>}
      </>
    );
  };

  return (
    <div className="allMovieslist-container">
      <HomeButton />
      <h1 className="allMovieslist-title">🎬 All Movies</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="table-wrapper">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th className="desc-col">Description</th>
              <th>Director</th>
              <th>Rating</th>
              <th className="comments-col">Comments</th>
              <th className="action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => {
              const rating = averageRating(movie.id);
              const comments =
                reviews[movie.id]?.map((r) => r.comment).join(", ") || "";

              return (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.description}</td>
                  <td>{movie.creator}</td>
                  <td>{rating ? renderStars(rating) : ""}</td>
                  <td>{comments}</td>
                  <td>
                    {movie.userId === userId ? (
                      <button
                        className="review-btn"
                        onClick={() => navigate(`/add-review/${movie.id}`)}
                      >
                        Review
                      </button>
                    ) : addedMovies.includes(movie.id) ? (
                      <span className="added-label">✔ Added</span>
                    ) : (
                      <button
                        className="add-btn"
                        onClick={() => handleAddToWatchlist(movie)}
                      >
                        + Add to Watchlist
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllMovies;
