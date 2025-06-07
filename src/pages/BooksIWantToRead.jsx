import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";
import "./BooksIWantToRead.css";
import HomeButton from "../components/HomeButton";

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
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      );
      setFormData((prev) => ({ ...prev, userId: uid }));
    }
  }, [token]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/media`, {
    headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    },
    });
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
    <div className="book-container">
      <HomeButton />
      <h1 className="book-title">Books I Want to Read</h1>

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
          placeholder="Author"
          value={formData.creator}
          onChange={handleChange}
        />
        <button type="submit">Add Book</button>
      </form>

      {books.length === 0 ? (
        <p className="no-books-msg">No books added yet.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.genre}</td>
                <td>{book.description}</td>
                <td>{book.creator}</td>
                <td>
                  <button onClick={() => handleMarkAsRead(book.id)}>
                    I’ve read this book
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

export default BooksIWantToRead;
