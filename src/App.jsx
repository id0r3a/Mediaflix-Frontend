import { useAuth } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./router"; // justera om din fil heter annorlunda
import "./App.css"; // för styling

function App() {
  const { message, clearMessage } = useAuth();

  return (
    <div>
      {message && (
        <div className="session-message" onClick={clearMessage}>
          {message}
        </div>
      )}

      {/* Här kommer resten av din app */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
