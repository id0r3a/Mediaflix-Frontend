import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./AllBooks.css"; 
import HomeButton from "../components/HomeButton";

function AllBooks() {
  const [userId, setUserId] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState({});
  const [addedBooks, setAddedBooks] = useState([]);
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
      const uid = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      );
      setUserId(uid);

      fetch(`${API_URL}/api/media`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const allBooks = data.filter((m) => m.type === "Book");
          setBooks(allBooks);

       allBooks.forEach((book) => {
  fetch(`${API_URL}/api/reviews/media/${book.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
    if (res.status === 204 || res.status === 404) return []; 
    return res.text().then(text => text ? JSON.parse(text) : []);
})
    .then((data) => {
      setReviews((prev) => ({ ...prev, [book.id]: data }));
    })
    .catch((err) => {
      console.error(`Failed to load reviews for book ${book.id}`, err);
    });
});
        })
        .catch(() => setError("Failed to load books."));
    } catch {
      setError("Invalid token.");
    }
  }, [token]);

  const handleAddToReadlist = async (book) => {
    if (!userId || !token) return;

    const payload = {
      Title: book.title,
      Genre: book.genre,
      Description: book.description,
      Creator: book.creator,
      Type: "Book",
      Status: "WantToRead",
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
        setAddedBooks((prev) => [...prev, book.id]);
      } else {
        const msg = await res.text();
        alert("Failed to add: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const averageRating = (bookId) => {
    const revs = reviews[bookId];
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
    <div className="allbooks-container">
      <HomeButton />
      <h1> All Books</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="table-wrapper">
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th className="desc-col">Description</th>
              <th>Author</th>
              <th>Rating</th>
              <th className="comments-col">Comments</th>
              <th className="action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              const rating = averageRating(book.id);
              const comments =
                reviews[book.id]?.map((r) => r.comment).join(", ") || "No comments";

              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.genre}</td>
                  <td>{book.description}</td>
                  <td>{book.creator}</td>
                  <td>{rating ? renderStars(rating) : "N/A"}</td>
                  <td>{comments}</td>
                  <td>
                    {book.userId === userId ? (
                      <button
                        className="review-btn"
                        onClick={() => navigate(`/add-review/${book.id}`)}
                      >
                        Review
                      </button>
                    ) : addedBooks.includes(book.id) ? (
                      <span className="added-label">✔ Added</span>
                    ) : (
                      <button
                        className="add-btn"
                        onClick={() => handleAddToReadlist(book)}
                      >
                        + Add to Readlist
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

export default AllBooks;
