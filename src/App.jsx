import { useAuth } from "./contexts/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./App.css";

function App() {
    const { message, clearMessage } = useAuth();

    return (
        <>
            {message && (
                <div className="session-message" onClick={clearMessage}>
                    {message}
                </div>
            )}
            <RouterProvider router={router} />
        </>
    );
}

export default App;
