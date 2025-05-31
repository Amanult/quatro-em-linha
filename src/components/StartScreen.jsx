import React, { useState } from "react";
import "./StartScreen.css";

export default function StartScreen({ onStart }) {
  const [mode, setMode] = useState(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  // Inicia o jogo no modo PvP com os nomes inseridos ou valores padrão
  const handleStartPvP = () => {
    const name1 = player1.trim() || "Jogador 1";
    const name2 = player2.trim() || "Jogador 2";
    onStart({ mode, player1: name1, player2: name2 });
  };

  // Inicia o jogo no modo CPU com nomes padrão
  const handleStartCPU = () => {
    onStart({ mode, player1: "Jogador 1", player2: "Computador" });
  };

  // Volta ao menu de seleção de modo
  const handleBack = () => {
    setMode(null);
    setPlayer1("");
    setPlayer2("");
  };

  return (
    <div className="start-screen">
      <h1>Bem-vindo ao 4 em Linha Especial</h1>
      {/* Só mostra as opções de modo enquanto não foi selecionado */}
      {mode === null && (
        <div className="mode-select-group">
          <button
            className="mode-select-btn"
            onClick={() => setMode("pvp")}
            type="button"
          >
            Jogador vs Jogador
          </button>
          <button
            className="mode-select-btn"
            onClick={() => setMode("cpu")}
            type="button"
          >
            Jogador vs Computador
          </button>
        </div>
      )}
      {/* Se modo PvP foi selecionado, mostra inputs e botão */}
      {mode === "pvp" && (
        <div>
          <div style={{ marginBottom: 18 }}>
            <input
              className="player-name-input"
              type="text"
              placeholder="Nome do Jogador 1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              maxLength={18}
              autoFocus
            />
            <input
              className="player-name-input"
              type="text"
              placeholder="Nome do Jogador 2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              maxLength={18}
              style={{ marginLeft: 12 }}
            />
          </div>
          <button onClick={handleStartPvP}>Começar Jogo</button>
          <button
            className="back-mode-btn"
            onClick={handleBack}
            type="button"
            style={{ marginLeft: 12 }}
          >
            Voltar
          </button>
        </div>
      )}
      {/* Se modo CPU foi selecionado, mostra só o botão e o voltar */}
      {mode === "cpu" && (
        <div>
          <button onClick={handleStartCPU}>Começar Jogo</button>
          <button
            className="back-mode-btn"
            onClick={handleBack}
            type="button"
            style={{ marginLeft: 12 }}
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
