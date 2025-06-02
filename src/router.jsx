// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddBook from "./pages/AddBook";
import MoviesIveWatched from "./pages/MoviesIveWatched";
import MoviesWantToWatch from "./pages/MoviesWantToWatch";
import AllMovies from "./pages/AllMovies";
import AddReview from "./pages/AddReview";
import ReviewBook from "./pages/ReviewBook";
import AddMovie from "./pages/AddMovie";

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
    path: "/add-book",
    element: (
      <PrivateRoute>
        <AddBook />
      </PrivateRoute>
    ),
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
