import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ReviewBook.css'; // Bytte från ReviewBook.css till rätt fil

function ReviewMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(movieId || '');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hämta filmer
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not logged in.');
      return;
    }

    axios.get('https://localhost:7026/api/Media?type=Movie', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setMovies(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load movies.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie) {
      setError('Please select a movie.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://localhost:7026/api/reviews', {
        mediaId: selectedMovie,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Review submitted successfully!');
      setSelectedMovie('');
      setRating(1);
      setComment('');
      setError('');

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit review.');
    }
  };

  return (
    <div className="review-overlay">
      <div className="review-container">
        <h2>Review a Movie</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Select Movie:
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
            >
              <option value="">-- Select a movie --</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
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
                  className={`star ${star <= rating ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
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
          </label>

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewMovie;
