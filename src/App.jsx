import React, { useState } from "react";
import Game from "./components/Game";
import StartScreen from "./components/StartScreen";

export default function App() {
  // Estado para saber se o jogo já começou
  const [gameStarted, setGameStarted] = useState(false);
  // Estado para guardar o modo de jogo (pvp ou cpu)
  const [gameMode, setGameMode] = useState("pvp");
  // Estado para guardar o score dos jogadores e do computador
  const [score, setScore] = useState({ player1: 0, player2: 0, cpu: 0 });
  // Estado para guardar os nomes dos jogadores
  const [playerNames, setPlayerNames] = useState({
    player1: "Jogador 1",
    player2: "Jogador 2",
  });

  // Função para voltar ao ecrã inicial
  const resetToStart = () => setGameStarted(false);

  // Função chamada quando alguém vence, para atualizar o score
  const handleGameEnd = (winner, mode) => {
    if (winner === 1) setScore((s) => ({ ...s, player1: s.player1 + 1 }));
    if (winner === 2 && mode === "pvp")
      setScore((s) => ({ ...s, player2: s.player2 + 1 }));
    if (winner === 2 && mode === "cpu") setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
  };

  return (
    <div className="app-container">
      {/* Mostra o ecrã inicial ou o jogo conforme o estado */}
      {!gameStarted ? (
        <StartScreen
          // Passa função para iniciar o jogo e guardar o modo e nomes escolhidos
          onStart={({ mode, player1, player2 }) => {
            setGameMode(mode);
            setPlayerNames({ player1, player2 });
            setGameStarted(true);
          }}
        />
      ) : (
        <Game
          onBackToStart={resetToStart}
          mode={gameMode} // Passa o modo selecionado
          score={score} // Passa o score atual
          onGameEnd={handleGameEnd} // Passa função para atualizar score
          playerNames={playerNames} // Passa os nomes dos jogadores
        />
      )}
    </div>
  );
}
