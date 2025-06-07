// src/pages/AddReview.jsx
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config";
import HomeButton from "../components/HomeButton";

function AddReview() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const token = localStorage.getItem("token");

  try {
    const decoded = jwtDecode(token);
    const userId = parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        mediaId: parseInt(movieId),
        userId, 
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to submit review");
    }

    setSuccess("Review submitted!");
    setTimeout(() => navigate("/all-movies"), 1000);
  } catch (err) {
    console.error(err);
    setError("Failed to submit review.");
  }
};

  return (
    <div className="welcome-container" style={{ padding: "2rem", color: "white" }}>
       <HomeButton />
      <h2>Add Review</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} required>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          style={{ padding: "0.5rem", minHeight: "100px", borderRadius: "8px", fontSize: "1rem" }}
        />

        <button
          type="submit"
          style={{
            background: "#6b4b42",
            color: "white",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit Review
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen" }}>{success}</p>}
      </form>
    </div>
  );
}

export default AddReview;
