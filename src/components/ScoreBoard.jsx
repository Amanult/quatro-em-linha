import React from "react"; // Importa React

// Componente funcional que mostra o placar dos jogadores ou do computador
function ScoreBoard({ score, mode, playerNames }) {
  // Renderiza o placar com nomes e pontuações
  return (
    <div className="score-board">
      {/* Mostra o nome do Jogador 1 e o seu score */}
      <span>
        {playerNames?.player1 || "Jogador 1"}: <b>{score.player1}</b>
      </span>
      {/* Se o modo for PvP, mostra o nome do Jogador 2 e o seu score */}
      {mode === "pvp" ? (
        <span style={{ marginLeft: 16 }}>
          {playerNames?.player2 || "Jogador 2"}: <b>{score.player2}</b>
        </span>
      ) : (
        // Se o modo for CPU, mostra "Computador" e o score do computador
        <span style={{ marginLeft: 16 }}>
          {playerNames?.player2 || "Computador"}: <b>{score.cpu}</b>
        </span>
      )}
    </div>
  );
}

export default ScoreBoard; // Exporta o componente
