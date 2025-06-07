import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./BooksIveRead.css";
import HomeButton from "../components/HomeButton";

function BooksIveRead() {
  const [readBooks, setReadBooks] = useState([]);
  const [reviews, setReviews] = useState({});
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
      const userId = parseInt(
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      );

      fetch(`${API_URL}/api/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch media");
          return res.json();
        })
        .then((data) => {
          const read = data.filter(
            (item) =>
              item.type?.trim().toLowerCase() === "book" &&
              item.status?.trim().toLowerCase() === "read"
          );

          setReadBooks(read);

          //  Hämta recensioner för varje läst bok
          read.forEach((book) => {
            fetch(`${API_URL}/api/reviews/media/${book.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Failed to fetch reviews for book ${book.id}`);
                }
                return res.json();
              })
              .then((data) => {
                setReviews((prev) => ({ ...prev, [book.id]: data }));
              })
              .catch((err) => {
                console.error("Review fetch failed:", err); // Felhantering
              });
          });
        })
        .catch((err) => {
          console.error("Error fetching media:", err);
          setError("Failed to load read books.");
        });
    } catch (err) {
      console.error("JWT decode failed:", err);
      setError("Invalid token.");
    }
  }, [token]);

  const averageRating = (bookId) => {
    const revs = reviews[bookId];
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
    <div className="book-container">
      <HomeButton />
      <h1 className="book-title"> Books I've Read</h1>

      {error && <p className="error-msg">{error}</p>}

      {readBooks.length === 0 && !error ? (
        <p className="no-books-msg">No books marked as read yet.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {readBooks.map((book) => {
              const rating = averageRating(book.id);
              const comments =
                reviews[book.id]?.map((r) => r.comment).join(", ") || "No comments";

              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.genre}</td>
                  <td>{book.description}</td>
                  <td>{book.creator}</td>
                  <td>{rating ? renderStars(rating) : "No reviews yet"}</td>
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

export default BooksIveRead;
