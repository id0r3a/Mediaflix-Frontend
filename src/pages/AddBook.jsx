import { useState } from "react";
import "./AddBook.css";
import bgImage from "../assets/bild.png";


function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Book",   // Förifyllt som 'Book'
    status: "WantToRead",  // Förifyllt som 'WantToRead'
     userId: 1,
  });

  const [message, setMessage] = useState("");

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
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Book added successfully!");
        setFormData({
          title: "",
          genre: "",
          description: "",
          creator: "",
          type: "Book",
          status: "WantToRead",
          userId: 1
        });
      } else {
        setMessage("Failed to add book.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error occurred.");
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
            justifyContent: "center"
        }}
    >
        <div className="addbook-container">
            <h2>Add a New Book</h2>
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
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="WantToRead">Want to Read</option>
                    <option value="Read">Read</option>
                </select>
                <button type="submit">Add Book</button>
            </form>
        </div>
    </div>
);
}

export default AddBook;
