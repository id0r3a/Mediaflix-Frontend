import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./MoviesIveWatched.css";

function MoviesIveWatched() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reviews, setReviews] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
  if (!token) {
  console.error("No token found in localStorage.");
  setError("You must be logged in.");
  return;
}
console.log("Token value:", token);


  try {
    const decoded = jwtDecode(token);
    const userId = parseInt(
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    );

        console.log("Fetched media sample:", data.slice(0, 5).map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      status: m.status,
      userId: m.userId,
    })));


    fetch(`${API_URL}/api/media/user/${userId}`, {
  headers: { Authorization: `Bearer ${token}` }
})

      .then((res) => res.json())
      .then((data) => {
        console.log("Sample of fetched media:", data.slice(0, 5).map(m => ({
          id: m.id,
          title: m.title,
          type: m.type,
          status: m.status,
          userId: m.userId
        })));


        const watched = data.filter(
          (item) =>
            item.type?.toLowerCase() === "movie" &&
            item.status?.toLowerCase() === "watched" &&
            item.userId === userId
        );

        setWatchedMovies(watched);

        watched.forEach((movie) => {
          fetch(`${API_URL}/reviews/media/${movie.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((data) => {
              setReviews((prev) => ({ ...prev, [movie.id]: data }));
            });
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load watched movies.");
      });
  } catch (err) {
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
    <div
      className="welcome-container"
      style={{
        padding: "2rem",
        color: "white",
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
      }}
    >
      <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2rem" }}>
        🎥 Movies I've Watched
      </h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {watchedMovies.length === 0 ? (
        <p style={{ textAlign: "center" }}>No watched movies yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            background: "#1e1e1e",
            color: "white",
            borderCollapse: "collapse",
            fontSize: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Genre</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Director</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Comments</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {watchedMovies.map((movie) => {
              const rating = averageRating(movie.id);
              const comments =
                reviews[movie.id]?.map((r) => r.comment).join(", ") || "No comments";

              return (
                <tr key={movie.id}>
                  <td style={tdStyle}>{movie.title}</td>
                  <td style={tdStyle}>{movie.genre}</td>
                  <td style={tdStyle}>{movie.description}</td>
                  <td style={tdStyle}>{movie.creator}</td>
                  <td style={tdStyle}>{rating ? renderStars(rating) : "N/A"}</td>
                  <td style={tdStyle}>{comments}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => navigate(`/add-review/${movie.id}`)}
                      style={btnStyle}
                    >
                      Add/Update Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #444",
  padding: "0.7rem",
  backgroundColor: "#2c2c2c",
  fontWeight: "bold",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #444",
  padding: "0.7rem",
  verticalAlign: "top",
  wordBreak: "break-word",
};

const btnStyle = {
  padding: "0.4rem 0.8rem",
  background: "#6b4b42",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default MoviesIveWatched;
