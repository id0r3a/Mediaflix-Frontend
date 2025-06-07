
import { useNavigate } from "react-router-dom";


function HomeButton() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/dashboard");
  };

  return (
    <button className="logout-btn home-btn" onClick={goHome}>
      Home
    </button>
  );
}

export default HomeButton;
