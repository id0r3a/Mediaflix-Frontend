// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddBook from "./pages/AddBook";
//import ReviewBook from "./pages/ReviewBook";
//import AllBooks from "./pages/AllBooks";
//import BooksIveRead from "./pages/BooksIveRead";
//import BooksWantToRead from "./pages/BooksWantToRead";

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

]);

export default router;
