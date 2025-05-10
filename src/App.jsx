import React, { useState } from "react";
import Game from "./components/Game";
import StartScreen from "./components/StartScreen"; // Importa o componente da tela inicial

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const resetToStart = () => setGameStarted(false); // Função para voltar ao início

  return (
    <div className="app-container">
      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} /> // Usa o novo componente
      ) : (
        <Game onBackToStart={resetToStart} /> // Passa a função para o componente Game
      )}
    </div>
  );
}
