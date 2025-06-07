import { useEffect, useState } from "react";
import "./AddBook.css";
import bgImage from "../assets/bild.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";



function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    creator: "",
    type: "Book",   // Förifyllt som 'Book'
    status: "WantToRead",  // Förifyllt som 'WantToRead'
    userId: null,
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

   const navigate = useNavigate();

  // hämta userId från token
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); 

  try {
    const response = await fetch("https://localhost:7026/api/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("New book saved with ID:", data.id);
      setMessage("Book added successfully!");

        //Redirect till books-want-to-read-sidan efter bok tillagd
        navigate("/books-want-to-read");
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
    ><HomeButton />
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
