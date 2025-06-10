import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./MoviesWantToWatch.css";
import HomeButton from "../components/HomeButton";

function MoviesWantToWatch() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Movie",
    status: "WantToWatch",
    userId: null,
  });

  const [message, setMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const uid = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );
      setFormData((prev) => ({ ...prev, userId: uid }));
    }
  }, [token]);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/api/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const wantToWatch = data.filter(
        (m) => m.type === "Movie" && m.status === "WantToWatch"
      );
      setMovies(wantToWatch);
    } catch (err) {
      console.error("Failed to fetch movies", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [token, message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedMovie = await response.json();
        setMovies((prev) => [...prev, savedMovie]);
        setMessage("Movie added!");
        setFormData({
          title: "",
          genre: "",
          description: "",
          creator: "",
          type: "Movie",
          status: "WantToWatch",
          userId: formData.userId,
        });
      } else {
        setMessage("Failed to add movie.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error occurred.");
    }
  };

  const handleMarkAsWatched = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/api/media/${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Watched" }),
    });

    if (response.ok) {
      // Navigera först efter att statusen uppdaterats
      navigate(`/review/${movieId}`);
    } else {
      console.error("Failed to update movie status to Watched");
    }
  } catch (err) {
    console.error("Error updating movie status:", err);
  }
};

  return (
    <div className="movie-container">
      <HomeButton />
      <h1 className="movie-title">🎬 Movies I Want to Watch</h1>

      {message && <p className="error-msg">{message}</p>}

      <form onSubmit={handleSubmit} className="addbook-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="creator"
          placeholder="Director"
          value={formData.creator}
          onChange={handleChange}
        />
        <button type="submit">Add Movie</button>
      </form>

      {movies.length === 0 ? (
        <p className="no-movies-msg">No movies in your list yet.</p>
      ) : (
        <table className="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Director</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{movie.description}</td>
                <td>{movie.creator}</td>
                <td>
                  <button onClick={() => handleMarkAsWatched(movie.id)}>
                    I’ve watched this movie
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MoviesWantToWatch;
