// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Welcome from "./pages/Welcome";
import PrivateRoute from "./components/PrivateRoute";
import AddBook from "./pages/AddBook";
import MoviesIveWatched from "./pages/MoviesIveWatched";
import MoviesWantToWatch from "./pages/MoviesWantToWatch";
import AllMovies from "./pages/AllMovies";
import AddReview from "./pages/AddReview";
import ReviewBook from "./pages/ReviewBook";
import AddMovie from "./pages/AddMovie";
import AllBooks from "./pages/AllBooks";
import BooksIveRead from "./pages/BooksIveRead";
import BooksIWantToRead from "./pages/BooksIWantToRead";
import Dashboard from "./pages/Dashboard";
import ReviewMovie from './pages/ReviewMovie';
import LoginForm from "./forms/LoginForm";


const router = createBrowserRouter([
  { path: "/", element: <Welcome /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
  path: "/login",
  element: <LoginForm />,
},
  {
    path: "/add-book",
    element: (
      <PrivateRoute>
        <AddBook />
      </PrivateRoute>
    ),
  },
  {
    path: "/all-books",
    element: (
      <PrivateRoute>
        <AllBooks />
      </PrivateRoute>
    ),
  },
  {
    path: "/books-want-to-read",
    element: (
      <PrivateRoute>
        <BooksIWantToRead />
      </PrivateRoute>
    ),
  },
  {
    path: "/books-ive-read",
    element: (
      <PrivateRoute>
        <BooksIveRead />
      </PrivateRoute>
    ),
  },
  {
    path: "/review/:bookId",
    element: <ReviewBook />,
  },

  {
    path: "/movies-want-to-watch",
    element: (
      <PrivateRoute>
        <MoviesWantToWatch />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-movie",
    element: (
      <PrivateRoute>
        <AddMovie />
      </PrivateRoute>
    ),
  },
  {
  path: "/review-movie",
  element: (
    <PrivateRoute>
      <ReviewMovie />
    </PrivateRoute>
  ),
},
  {
    path: "/all-movies",
    element: (
      <PrivateRoute>
        <AllMovies />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-review/:id",
    element: (
      <PrivateRoute>
        <AddReview />
      </PrivateRoute>
    ),
  },
  {
    path: "/movies-ive-watched",
    element: (
      <PrivateRoute>
        <MoviesIveWatched />
      </PrivateRoute>
    ),
  },
  {
    path: "/review",
    element: <ReviewBook />,
  },
]);

export default router;
