import React from "react";

// Componente ScoreBoard: mostra o score dos jogadores ou do computador
function ScoreBoard({ score, mode, playerNames }) {
  return (
    <div className="score-board">
      <span>
        {playerNames?.player1 || "Jogador 1"}: <b>{score.player1}</b>
      </span>
      {mode === "pvp" ? (
        <span style={{ marginLeft: 16 }}>
          {playerNames?.player2 || "Jogador 2"}: <b>{score.player2}</b>
        </span>
      ) : (
        <span style={{ marginLeft: 16 }}>
          {playerNames?.player2 || "Computador"}: <b>{score.cpu}</b>
        </span>
      )}
    </div>
  );
}

export default ScoreBoard;
