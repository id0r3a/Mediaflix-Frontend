import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ReviewBook.css';
import HomeButton from "../components/HomeButton";


function ReviewBook() {
  const { bookId } = useParams(); // <-- fånga ID från URL
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(bookId || ''); // <-- sätt initialt från URL
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //hämta böcker
useEffect(() => {
  const token = localStorage.getItem('token'); // Hämta token

  axios.get('https://localhost:7026/api/Media', {
    headers: {
      Authorization: `Bearer ${token}`,
       "Content-Type": "application/json"
    }
  })
    .then(res => {
      setBooks(res.data);
      console.log(res.data);
    })
    .catch(err => {
      console.error(err);
      setError('Could not load books. Are you logged in?');
    });
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) {
      setError('Please select a book.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
    await axios.post('https://localhost:7026/api/reviews', {
   mediaId: parseInt(selectedBook, 10),
   rating,
   comment,
}, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});

      setSuccess('Review submitted successfully!');
      setSelectedBook('');
      setRating(1);
      setComment('');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000); // gå tillbaka efter 2 sek
    } catch (err) {
      console.error(err);
      setError('Failed to submit review.');
    }
  };

  return (
    <div className="review-overlay">
      <HomeButton />
      <div className="review-container">
        <h2>Review a Book</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Select Book:
            <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
              <option value="">-- Select a book --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Rating:
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setRating(star)}
                  onMouseLeave={() => setRating(rating)}
                >
                  ★
                </span>
              ))}
            </div>
          </label>

         <label>
        Comment:
       <textarea
       value={comment}
       onChange={(e) => setComment(e.target.value)}
     />
         <small style={{ color: "#bbb" }}>
        (Comment must be at least 3 characters long)
        </small>
        </label>

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewBook;
