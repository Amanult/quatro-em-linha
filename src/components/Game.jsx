// Importa os hooks React necessários e os componentes filhos
import React, { useEffect, useState, useRef } from "react";
import Board from "./Board"; // Componente do tabuleiro do jogo
import ScoreBoard from "./ScoreBoard"; // Componente do placar
import "./Game.css"; // Ficheiro de estilos CSS para este componente

// Definição das constantes para o número de linhas, colunas e tempo máximo por jogada
const ROWS = 6; // Número de linhas do tabuleiro
const COLS = 7; // Número de colunas do tabuleiro
const MAX_TIME = 10; // Tempo máximo (em segundos) para cada jogada

// Função utilitária para criar um tabuleiro vazio (array 2D preenchido com null)
const createEmptyBoard = () =>
  Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));

// Função para gerar aleatoriamente 5 células especiais no tabuleiro
const generateSpecialCells = () => {
  const specials = new Set(); // Usa um Set para garantir que as células especiais são únicas
  while (specials.size < 5) {
    // Gera coordenadas aleatórias (linha, coluna)
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    // Adiciona a célula como string "row,col"
    specials.add(`${row},${col}`);
  }
  // Retorna um array com as coordenadas das células especiais
  return Array.from(specials);
};

// Função para verificar se o tabuleiro está cheio (nenhuma célula vazia)
const isBoardFull = (board) =>
  board.every((row) => row.every((cell) => cell !== null));

// Componente principal do jogo
export default function Game({
  onBackToStart, // Callback para voltar à tela inicial
  mode = "pvp", // Modo de jogo: "pvp" (jogador contra jogador) ou "cpu" (contra o computador)
  score, // Pontuação atual
  onGameEnd, // Callback chamado ao final da partida
  playerNames, // Nomes dos jogadores
}) {
  // Estados React para gerenciar o tabuleiro, o jogador atual, o vencedor, etc.
  const [board, setBoard] = useState(createEmptyBoard()); // Tabuleiro do jogo
  const [player, setPlayer] = useState(() => (Math.random() < 0.5 ? 1 : 2)); // Jogador atual (1 ou 2), escolhido aleatoriamente no início
  const [winner, setWinner] = useState(null); // Vencedor da partida (1, 2 ou "Empate" para igualdade)
  const [specialCells, setSpecialCells] = useState(generateSpecialCells()); // Células especiais do tabuleiro
  const [timer, setTimer] = useState(0); // Tempo decorrido para a jogada atual
  const timerRef = useRef(null); // Referência para armazenar o intervalo do timer
  const [skipTurn, setSkipTurn] = useState(false); // Indica se a jogada deve ser pulada (após o tempo esgotado)
  const [fallingCell, setFallingCell] = useState(null); // Célula em animação de queda
  const [winningCells, setWinningCells] = useState([]); // Células que formam a combinação vencedora
  const [hoverCol, setHoverCol] = useState(null); // Coluna sobre a qual o mouse está passando
  const [showTimeoutMsg, setShowTimeoutMsg] = useState(false); // Exibe uma mensagem se o tempo esgotou

  // Função para reconfigurar a partida e todos os estados associados
  const resetGame = () => {
    setBoard(createEmptyBoard()); // Reconfigura o tabuleiro
    setPlayer(Math.random() < 0.5 ? 1 : 2); // Escolhe aleatoriamente o jogador que começa
    setWinner(null); // Reconfigura o vencedor
    setSpecialCells(generateSpecialCells()); // Gera novas células especiais
    setTimer(0); // Reconfigura o timer
    setSkipTurn(false); // Reconfigura a passagem de jogada
    setFallingCell(null); // Reconfigura a animação de queda
    setWinningCells([]); // Reconfigura as células vencedoras
    setHoverCol(null); // Reconfigura a coluna sobre a qual o mouse está passando
    restartTimer(); // Reinicia o timer
  };

  // Função utilitária para verificar se uma célula é especial
  const isSpecial = (row, col) => specialCells.includes(`${row},${col}`);

  // Função para verificar se há um vencedor e retornar as células vencedoras
  const checkWinner = (board) => {
    // Lista de direções a verificar (horizontal, vertical, diagonais)
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal principal
      [1, -1], // Diagonal secundária
    ];
    // Percorre cada célula do tabuleiro
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const current = board[r][c]; // Valor da célula atual
        if (!current) continue; // Ignora as células vazias
        // Verifica cada direção
        for (let [dr, dc] of directions) {
          let count = 1; // Contador de peças alinhadas
          let cells = [[r, c]]; // Lista das células alinhadas
          for (let i = 1; i < 4; i++) {
            const nr = r + dr * i; // Nova linha
            const nc = c + dc * i; // Nova coluna
            // Verifica os limites e a continuidade da cor
            if (
              nr < 0 ||
              nr >= ROWS ||
              nc < 0 ||
              nc >= COLS ||
              board[nr][nc] !== current
            )
              break;
            cells.push([nr, nc]);
            count++;
          }
          if (count === 4) return { winner: current, cells }; // Retorna o vencedor e as células vencedoras
        }
      }
    }
    return null; // Nenhum vencedor encontrado
  };

  // Passa para o próximo jogador (1 <-> 2)
  const nextPlayer = () => setPlayer(player === 1 ? 2 : 1);

  // Reinicia o timer para a jogada atual
  const restartTimer = () => {
    setTimer(0); // Reconfigura o timer para 0
    if (timerRef.current) clearInterval(timerRef.current); // Limpa o antigo intervalo se necessário
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev + 1 >= MAX_TIME) {
          clearInterval(timerRef.current); // Para o timer se o tempo esgotou
          setShowTimeoutMsg(true); // Exibe a mensagem de tempo esgotado
          return MAX_TIME;
        }
        return prev + 1; // Incremente o timer
      });
    }, 1000); // Incrementa a cada segundo
  };

  // Função para o computador jogar (escolhe uma coluna válida aleatoriamente)
  const computerMove = React.useCallback(() => {
    if (winner) return; // Não joga se a partida está terminada
    // Recupera as colunas onde uma peça pode ser jogada
    const validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) validCols.push(col);
    }
    if (validCols.length === 0) return; // Se nenhuma coluna válida, não faz nada
    // Escolhe uma coluna aleatória e joga
    const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
    handleClick(randomCol, true); // true = é o computador que está jogando
    // eslint-disable-next-line
  }, [board, winner, skipTurn]);

  // Função chamada quando um jogador (ou o computador) clica em uma coluna
  // Bloqueia as ações se a partida está finalizada, se a jogada deve ser pulada ou se a mensagem de timeout está sendo exibida
  const handleClick = (col, isComputer = false) => {
    if (winner || skipTurn || showTimeoutMsg) return;
    // Em modo CPU, apenas o computador pode jogar quando é a sua vez
    if (mode === "cpu" && player === 2 && !isComputer) return;
    // Copia o tabuleiro para modificação
    const newBoard = board.map((row) => [...row]);
    // Busca a primeira célula vazia da coluna (de baixo para cima)
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player; // Coloca a peça do jogador atual
        setBoard(newBoard); // Atualiza o tabuleiro
        setFallingCell({ row, col }); // Aciona a animação de queda
        const winResult = checkWinner(newBoard); // Verifica se há um vencedor
        if (winResult) {
          setWinner(winResult.winner); // Define o vencedor
          setWinningCells(winResult.cells); // Atualiza as células vencedoras
          clearInterval(timerRef.current); // Para o timer
          return;
        }
        if (isBoardFull(newBoard)) {
          setWinner("Empate"); // Declara o empate se o tabuleiro estiver cheio
          setWinningCells([]);
          clearInterval(timerRef.current);
          return;
        }
        if (!isSpecial(row, col)) {
          nextPlayer(); // Passa para o próximo jogador se a célula não é especial
        }
        restartTimer(); // Reinicia o timer para a próxima jogada
        return;
      }
    }
  };

  // Efeito : se é a vez do computador, ele joga automaticamente após um curto atraso
  useEffect(() => {
    if (mode === "cpu" && player === 2 && !winner && !skipTurn) {
      const timeout = setTimeout(() => {
        computerMove();
      }, 600); // Atraso para tornar a IA mais natural
      return () => clearTimeout(timeout);
    }
  }, [mode, player, winner, skipTurn, computerMove]);

  // Efeito : reconfigura a animação de queda após 450ms
  React.useEffect(() => {
    if (fallingCell) {
      const timeout = setTimeout(() => setFallingCell(null), 450);
      return () => clearTimeout(timeout);
    }
  }, [fallingCell]);

  // Efeito : inicia o timer ao carregar o componente
  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current); // Limpa o timer na destruição do componente
  }, []);

  // Efeito : gerencia a passagem de jogada após um timeout
  useEffect(() => {
    if (skipTurn && !winner) {
      setSkipTurn(false); // Reconfigura a passagem de jogada
      nextPlayer(); // Passa para o próximo jogador
      restartTimer(); // Reinicia o timer
    }
  }, [skipTurn, winner]);

  // Efeito : exibe uma mensagem de timeout e depois passa a jogada após 2 segundos
  useEffect(() => {
    if (showTimeoutMsg && !winner) {
      const timeout = setTimeout(() => {
        setShowTimeoutMsg(false); // Oculta a mensagem
        setSkipTurn(true); // Passa a jogada
      }, 2000); // Exibe a mensagem por 2 segundos
      return () => clearTimeout(timeout);
    }
  }, [showTimeoutMsg, winner]);

  // Efeito : chama a função onGameEnd quando há um vencedor (para atualizar o placar)
  useEffect(() => {
    if (winner && winner !== "Empate" && onGameEnd) {
      onGameEnd(winner, mode);
    }
    // eslint-disable-next-line
  }, [winner]);

  // Renderização do componente
  return (
    <div className="game-container">
      <h1>4 em Linha Especial</h1>
      {/* Exibe a pontuação atual através do componente ScoreBoard */}
      <ScoreBoard score={score} mode={mode} playerNames={playerNames} />
      <p>
        {/* Exibe a mensagem apropriada conforme o estado do jogo */}
        {winner
          ? winner === "Empate"
            ? "O jogo terminou em empate!"
            : mode === "cpu" && winner === 2
            ? `${playerNames?.player2 || "Computador"} venceu!`
            : `${
                winner === 1 ? playerNames?.player1 : playerNames?.player2
              } venceu!`
          : mode === "cpu"
          ? player === 1
            ? `A tua vez!`
            : `Vez do ${playerNames?.player2 || "Computador"}...`
          : `Vez de ${
              player === 1 ? playerNames?.player1 : playerNames?.player2
            }`}
      </p>
      {/* Exibe um pop-up se o tempo esgotou */}
      {showTimeoutMsg && (
        <div className="timeout-popup">
          <span>
            ⏰ Tempo esgotado! A vez vai passar para o próximo jogador...
          </span>
        </div>
      )}
      {/* Barra de progressão do timer */}
      <div className="timer-bar-container">
        <div
          className="timer-bar"
          style={{
            width: `${(timer / MAX_TIME) * 100}%`,
            background: timer > MAX_TIME * 0.7 ? "#ef4444" : "#2563eb",
          }}
        ></div>
      </div>
      <p>Tempo: {timer}s</p>
      {/* Exibe o tabuleiro do jogo com todas as animações e interações */}
      <Board
        board={board}
        onClick={handleClick}
        specialCells={specialCells}
        fallingCell={fallingCell}
        winningCells={winningCells}
        hoverCol={hoverCol}
        setHoverCol={setHoverCol}
      />
      {/* Exibe os botões de reconfiguração e retorno ao menu se a partida está terminada */}
      {winner && (
        <div>
          <button className="reset-button" onClick={resetGame}>
            Jogar Novamente
          </button>
          <button className="back-button" onClick={onBackToStart}>
            Voltar ao Início
          </button>
        </div>
      )}
    </div>
  );
}
