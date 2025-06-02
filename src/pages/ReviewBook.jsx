import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReviewBook() {
    

  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hämta alla böcker
 useEffect(() => {
    axios.get('/media')  
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
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
      await axios.post('/reviews', {
        mediaId: selectedBook,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Review submitted successfully!');
      setSelectedBook('');
      setRating(1);
      setComment('');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000); // gå tillbaka till dashboard efter 2 sek
    } catch (err) {
      console.error(err);
      setError('Failed to submit review.');
    }
  };

  return (
    <div>
      <h2>Review a Book</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

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

        <br />

        <label>
          Rating (1-5):
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </label>

        <br />

        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        <br />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default ReviewBook;
