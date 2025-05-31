import React, { useState } from "react";
import Game from "./components/Game";
import StartScreen from "./components/StartScreen";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [vsCpu, setVsCpu] = useState(false);

  const resetToStart = () => setGameStarted(false);

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartScreen
          onStart={(cpu) => {
            setVsCpu(cpu);
            setGameStarted(true);
          }}
        />
      ) : (
        <Game onBackToStart={resetToStart} vsCpu={vsCpu} />
      )}
    </div>
  );
}
