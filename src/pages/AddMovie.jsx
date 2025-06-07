import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./AddBook.css"; // återanvänd stil
import bgImage from "../assets/bild.png";
import HomeButton from "../components/HomeButton";

function AddMovie() {
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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const uid = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );
      setFormData((prev) => ({ ...prev, userId: uid }));
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7026/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedMovie = await response.json();
        console.log("Movie saved:", savedMovie);
        setMessage("Movie added successfully!");

        // Navigera baserat på status
        if (formData.status === "Watched") {
          navigate("/movies-ive-watched");
        } else {
          navigate("/movies-want-to-watch");
        }
      } else {
        setMessage("Failed to add movie.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error occurred.");
    }
  };

  return (
    <div
      className="welcome-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HomeButton />
      <div className="addbook-container">
        <h2>Add a New Movie</h2>
        {message && <p>{message}</p>}
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
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="WantToWatch">Want to Watch</option>
            <option value="Watched">Watched</option>
          </select>
          <button type="submit">Add Movie</button>
        </form>
      </div>
    </div>
  );
}

export default AddMovie;
