//login screen
import react from "react";
import ReactDOM from "react-dom";
import Wave from "react-wavify";
import "../css/./style.css";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  //using history to handle navigation
  const history = useHistory();
  //handling login button - pushing the router to login page
  const handleButton = () => {
    history.push("/login");
  };
  return (
    <div id="home">
      <Wave
        className="wave"
        fill="url(#gradient)"
        options={{
          height: 5,
          amplitude: 55,
          speed: 0.1,
          points: 5,
        }}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor="#40a9ff" />
            <stop offset="90%" stopColor="#096dd9" />
          </linearGradient>
        </defs>
      </Wave>
      <div className="intro">
        <h1>
          <em className="highlight">Lets-Gist</em>
        </h1>
        <h3>Test Version of A Real-Time Chat App</h3>
        <button id="action-btn" onClick={handleButton}>
          Get Started! / Login
        </button>
      </div>
      <div className="footer">
        <p>Developer || Foster Ogwudu</p>
      </div>
    </div>
  );
};

export default HomePage;
