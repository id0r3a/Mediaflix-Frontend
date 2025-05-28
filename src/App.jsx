import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect (()=>{
    //Hämta böcker
    fetch('http://localhost:7026/api/books')
    .then(Response => response.json())
    .then(data => setBooks(data))
      .catch(error => console.error('Fel vid hämtning av böcker:', error));

      //Hämta filmer 
      fetch('http://localhost:7026/api/movies')
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Fel vid hämtning av filmer:', error));
  }, []);
 
  return (
    <div>
      <h1>Books</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>

      <h1>Movies</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
