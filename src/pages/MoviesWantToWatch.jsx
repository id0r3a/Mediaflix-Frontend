// src/pages/MoviesWantToWatch.jsx
import React, { useEffect, useState } from "react";
import API_URL from "../config";

function MoviesWantToWatch() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const wanted = data.filter(
          (movie) => movie.type === "Movie" && movie.status === "WantToWatch"
        );
        setMovies(wanted);
      })
      .catch((err) => console.error("Failed to load movies:", err));
  }, []);

  return (
    <div>
      <h2>Movies I Want to Watch</h2>
      {movies.length === 0 ? (
        <p>You have no movies marked as "want to watch".</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MoviesWantToWatch;
