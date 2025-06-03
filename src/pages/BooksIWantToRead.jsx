import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./BooksIWantToRead.css";

function BooksIWantToRead() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Book",
    status: "WantToRead",
    userId: null,
  });

  const [message, setMessage] = useState("");
  const [books, setBooks] = useState([]);
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/media`);
        const data = await res.json();
        const wantToRead = data.filter(
          (b) => b.type === "Book" && b.status === "WantToRead"
        );
        setBooks(wantToRead);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };
    fetchBooks();
  }, [message]);

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
  const savedBook = await response.json(); 
  setBooks((prevBooks) => [...prevBooks, savedBook]);
  setMessage("Book added!");
  setFormData({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Book",
    status: "WantToRead",
    userId: formData.userId,
  });
} else {
  setMessage("Failed to add book.");
}

    } catch (error) {
      console.error(error);
      setMessage("Error occurred.");
    }
  };

  const handleMarkAsRead = (bookId) => {
    navigate(`/review/${bookId}`);
  };

  return (
    <div className="want-to-read-container">
      <h2>Add a Book You Want to Read</h2>
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
          placeholder="Author"
          value={formData.creator}
          onChange={handleChange}
        />
        <button type="submit">Add Book</button>
      </form>

      <div className="want-to-read-list">
        <h3>My Want to Read List</h3>
        {books.length === 0 ? (
          <p>No books yet.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <span>{book.title}</span>
                <button onClick={() => handleMarkAsRead(book.id)}>
                  I've read this book
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BooksIWantToRead;
