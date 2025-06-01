import React, { useState } from "react"; // Importa React e o hook useState
import Game from "./components/Game"; // Importa o componente do jogo
import StartScreen from "./components/StartScreen"; // Importa o componente do ecrã inicial

// Componente principal da aplicação
export default function App() {
  // Estado para saber se o jogo já começou
  const [gameStarted, setGameStarted] = useState(false);
  // Estado para guardar o modo de jogo selecionado (pvp ou cpu)
  const [gameMode, setGameMode] = useState("pvp");
  // Estado para guardar o score dos jogadores e do computador
  const [score, setScore] = useState({ player1: 0, player2: 0, cpu: 0 });
  // Estado para guardar os nomes dos jogadores
  const [playerNames, setPlayerNames] = useState({
    player1: "Jogador 1",
    player2: "Jogador 2",
  });

  // Função para voltar ao ecrã inicial (define gameStarted como false)
  const resetToStart = () => setGameStarted(false);

  // Função chamada quando alguém vence, para atualizar o score
  const handleGameEnd = (winner, mode) => {
    if (winner === 1) setScore((s) => ({ ...s, player1: s.player1 + 1 }));
    if (winner === 2 && mode === "pvp")
      setScore((s) => ({ ...s, player2: s.player2 + 1 }));
    if (winner === 2 && mode === "cpu")
      setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
  };

  // Renderização do componente principal
  return (
    <div className="app-container">
      {/* Se o jogo ainda não começou, mostra o ecrã inicial */}
      {!gameStarted ? (
        <StartScreen
          // Função chamada ao iniciar o jogo, guarda modo e nomes escolhidos
          onStart={({ mode, player1, player2 }) => {
            setGameMode(mode);
            setPlayerNames({ player1, player2 });
            setGameStarted(true);
          }}
        />
      ) : (
        // Se o jogo começou, mostra o componente do jogo
        <Game
          onBackToStart={resetToStart}
          mode={gameMode}
          score={score}
          onGameEnd={handleGameEnd}
          playerNames={playerNames}
        />
      )}
    </div>
  );
}
