import React, { useState } from "react"; // Importa React e o hook useState
import "./StartScreen.css"; // Importa o CSS específico do ecrã inicial

// Componente funcional que representa o ecrã inicial do jogo
export default function StartScreen({ onStart }) {
  // Estado para guardar o modo de jogo selecionado (pvp ou cpu)
  const [mode, setMode] = useState(null);
  // Estado para guardar o nome do jogador 1
  const [player1, setPlayer1] = useState("");
  // Estado para guardar o nome do jogador 2 (apenas no modo PvP)
  const [player2, setPlayer2] = useState("");

  // Função chamada ao clicar em "Começar Jogo" no modo PvP
  // Usa os nomes inseridos ou valores padrão se estiverem vazios
  const handleStartPvP = () => {
    const name1 = player1.trim() || "Jogador 1"; // Se vazio, usa "Jogador 1"
    const name2 = player2.trim() || "Jogador 2"; // Se vazio, usa "Jogador 2"
    onStart({ mode, player1: name1, player2: name2 }); // Chama a função recebida por props para iniciar o jogo
  };

  // Função chamada ao clicar em "Começar Jogo" no modo CPU
  // Usa o nome inserido ou valor padrão, e define o adversário como "Computador"
  const handleStartCPU = () => {
    const name1 = player1.trim() || "Jogador 1";
    onStart({ mode, player1: name1, player2: "Computador" });
  };

  // Função para voltar ao menu de seleção de modo
  // Limpa os estados dos nomes e do modo
  const handleBack = () => {
    setMode(null);
    setPlayer1("");
    setPlayer2("");
  };

  // Renderização do componente
  return (
    <div className="start-screen">
      {/* Título do jogo */}
      <h1>Bem-vindo ao 4 em Linha Especial</h1>
      {/* Mostra os botões de seleção de modo se nenhum modo estiver selecionado */}
      {mode === null && (
        <div className="mode-select-group">
          {/* Botão para selecionar modo Jogador vs Jogador */}
          <button
            className="mode-select-btn"
            onClick={() => setMode("pvp")}
            type="button"
          >
            Jogador vs Jogador
          </button>
          {/* Botão para selecionar modo Jogador vs Computador */}
          <button
            className="mode-select-btn"
            onClick={() => setMode("cpu")}
            type="button"
          >
            Jogador vs Computador
          </button>
        </div>
      )}
      {/* Se o modo PvP foi selecionado, mostra inputs para nomes dos dois jogadores e botões de ação */}
      {mode === "pvp" && (
        <div>
          <div style={{ marginBottom: 18 }}>
            {/* Input para nome do Jogador 1 */}
            <input
              className="player-name-input"
              type="text"
              placeholder="Nome do Jogador 1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              maxLength={18}
              autoFocus
            />
            {/* Input para nome do Jogador 2 */}
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
          {/* Botão para começar o jogo no modo PvP */}
          <button onClick={handleStartPvP}>Começar Jogo</button>
          {/* Botão para voltar ao menu de seleção de modo */}
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
      {/* Se o modo CPU foi selecionado, mostra input para nome do jogador e botões de ação */}
      {mode === "cpu" && (
        <div>
          <div style={{ marginBottom: 18 }}>
            {/* Input para nome do Jogador */}
            <input
              className="player-name-input"
              type="text"
              placeholder="Nome do Jogador"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              maxLength={18}
              autoFocus
            />
          </div>
          {/* Botão para começar o jogo contra o computador */}
          <button onClick={handleStartCPU}>Começar Jogo</button>
          {/* Botão para voltar ao menu de seleção de modo */}
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
