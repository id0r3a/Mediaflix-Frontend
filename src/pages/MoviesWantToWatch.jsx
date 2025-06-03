import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./AllMovies.css"; // använder din befintliga snygga stil

function MoviesWantToWatch() {
  const [movies, setMovies] = useState([]);
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
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          const filtered = data.filter(
            (item) =>
              item.type?.toLowerCase() === "movie" &&
              item.status?.toLowerCase() === "wanttowatch" &&
              item.userId === userId
          );
          setMovies(filtered);
        })
        .catch((err) => {
          console.error("Error fetching movies:", err);
          setError("Failed to load movies.");
        });
    } catch (err) {
      console.error("JWT decode error:", err);
      setError("Invalid token.");
    }
  }, [token]);

  return (
    <div className="allmovies-container">
      <h1>🎥 Movies I Want to Watch</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {movies.length === 0 && !error ? (
        <p style={{ textAlign: "center" }}>No movies marked as "want to watch".</p>
      ) : (
        <div className="table-wrapper">
          <table className="movie-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Title</th>
                <th style={{ width: "15%" }}>Genre</th>
                <th className="desc-col">Description</th>
                <th style={{ width: "20%" }}>Director</th>
                <th className="comments-col">Status</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.description}</td>
                  <td>{movie.creator}</td>
                  <td>{movie.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MoviesWantToWatch;
