import { useState } from "react";
import "./App.css";
import CardContainer from "./components/CardContainer";

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  return (
    <>
      <div className="header">
        <div className="leftside">
          <div className="title">Pokémon Memory Game</div>
          <div className="instructions">
            Match pairs of Pokémon images to earn points, but be careful,
          </div>
          <div className="instructions2">
            clicking on the same card more than once will reset your score.
          </div>
          <div className="instructions2">
            With over 1000 Pokémon featured, the challenge never ends!
          </div>
        </div>
        <div className="rightside">
          <div className="score">Score: {score}</div>
          <div className="best-score">Best Score: {highScore}</div>
        </div>
      </div>
      <CardContainer
        score={score}
        setScore={setScore}
        highScore={highScore}
        setHighScore={setHighScore}
      />
    </>
  );
}

export default App;
