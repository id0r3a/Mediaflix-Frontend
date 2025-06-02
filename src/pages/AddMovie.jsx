import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./AddBook.css"; // Återanvänd stil
import bgImage from "../assets/bild.png";

function AddMovie() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Movie",
    status: "WantToWatch",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Not logged in.");
        return;
      }

      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      const userId = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      if (!userId) {
        setMessage("Invalid user ID in token.");
        return;
      }

      const payload = {
        Title: formData.title,
        Genre: formData.genre,
        Description: formData.description,
        Creator: formData.creator,
        Type: formData.type,
        Status: formData.status,
        UserId: userId,
      };

      const response = await fetch("https://localhost:7026/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Movie added successfully!");
        setFormData({
          title: "",
          genre: "",
          description: "",
          creator: "",
          type: "Movie",
          status: "WantToWatch",
        });
      } else {
        const errText = await response.text();
        setMessage("Failed to add movie: " + errText);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
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
      <div className="addbook-container">
        <h2>Add a New Movie</h2>

        {message && (
          <p
            style={{
              whiteSpace: "pre-wrap",
              maxWidth: "400px",
              margin: "0 auto",
              color: "lightcoral",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

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
