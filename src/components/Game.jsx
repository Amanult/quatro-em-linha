import React, { useEffect, useState, useRef } from "react";
import Board from "./Board";
import "./Game.css";

// Constantes para definir o número de linhas, colunas e o tempo máximo por jogada
const ROWS = 6;
const COLS = 7;
const MAX_TIME = 10; // tempo máximo por jogada (segundos)

// Função para criar um tabuleiro vazio
const createEmptyBoard = () =>
  Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));

// Função para gerar células especiais aleatórias
const generateSpecialCells = () => {
  const specials = new Set(); // Set é um estrutura js que permite de garantir que cada elemento é unico
  while (specials.size < 5) {
    /*
    Math.random cria um numero entre [0;1[
    Multiplicado por ROWS ou COLS permite obter um numero entre [0;R/C - 0.(1)[
    Math.floor permite aredondar ao inteiro infrior 4.6 -> 4
    No final obtemos um numero entre [0;R/C - 1[
    */
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    //Additionna a specials as coordenadas na forma de uma cadeia de characteres "row,col"
    specials.add(`${row},${col}`);
  }
  // retorna um array formado a partir das coordenadas de specials
  return Array.from(specials);
};

// Função para verificar se o tabuleiro está cheio (empate)
const isBoardFull = (board) =>
  board.every((row) => row.every((cell) => cell !== null));

// Componente principal do jogo
export default function Game({ onBackToStart, mode = "pvp", score, onGameEnd, playerNames }) {
  // Estados para armazenar o tabuleiro, jogador atual, vencedor, células especiais, etc.
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [specialCells, setSpecialCells] = useState(generateSpecialCells());
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null); // Referência para o temporizador
  const [skipTurn, setSkipTurn] = useState(false);
  const [fallingCell, setFallingCell] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [hoverCol, setHoverCol] = useState(null);
  const [showTimeoutMsg, setShowTimeoutMsg] = useState(false); // novo estado para aviso de tempo

  // Função para reiniciar o jogo e resetar todos os estados relevantes
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setPlayer(1);
    setWinner(null);
    setSpecialCells(generateSpecialCells());
    setTimer(0);
    setSkipTurn(false);
    setFallingCell(null);
    setWinningCells([]);
    setHoverCol(null);
    restartTimer();
  };

  // Verifica se uma célula é especial
  const isSpecial = (row, col) => specialCells.includes(`${row},${col}`);

  // Função para verificar se há um vencedor e retornar as células vencedoras
  const checkWinner = (board) => {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal principal
      [1, -1], // Diagonal secundária
    ];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const current = board[r][c];
        if (!current) continue;
        for (let [dr, dc] of directions) {
          let count = 1;
          let cells = [[r, c]];
          for (let i = 1; i < 4; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
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
          if (count === 4) return { winner: current, cells };
        }
      }
    }
    return null;
  };

  // Alterna para o próximo jogador
  const nextPlayer = () => setPlayer(player === 1 ? 2 : 1);

  // Reinicia o temporizador
  const restartTimer = () => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev + 1 >= MAX_TIME) {
          clearInterval(timerRef.current);
          setShowTimeoutMsg(true); // mostra aviso de tempo esgotado
          return MAX_TIME;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Função para o computador jogar (movimento aleatório)
  const computerMove = React.useCallback(() => {
    if (winner) return;
    // Encontrar colunas válidas (não cheias)
    const validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) validCols.push(col);
    }
    if (validCols.length === 0) return;
    // Escolher uma coluna aleatória e jogar
    const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
    handleClick(randomCol, true); // true = isComputer
  // eslint-disable-next-line
  }, [board, winner, skipTurn]);

  // handleClick modificado para bloquear jogadas durante aviso de tempo
  const handleClick = (col, isComputer = false) => {
    if (winner || skipTurn || showTimeoutMsg) return; // bloqueia jogadas durante aviso
    // Se for modo CPU e for vez do computador, só aceita jogada automática
    if (mode === "cpu" && player === 2 && !isComputer) return;
    const newBoard = board.map((row) => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        setBoard(newBoard);
        setFallingCell({ row, col }); // ativa animação de queda
        const winResult = checkWinner(newBoard);
        if (winResult) {
          setWinner(winResult.winner);
          setWinningCells(winResult.cells); // ativa animação de vitória
          clearInterval(timerRef.current);
          return;
        }
        if (isBoardFull(newBoard)) {
          setWinner("Empate");
          setWinningCells([]);
          clearInterval(timerRef.current);
          return;
        }
        if (!isSpecial(row, col)) {
          nextPlayer();
        }
        restartTimer();
        return;
      }
    }
  };

  // Efeito: se for modo CPU e for vez do computador, faz jogada automática após pequeno delay
  useEffect(() => {
    if (mode === "cpu" && player === 2 && !winner && !skipTurn) {
      const timeout = setTimeout(() => {
        computerMove();
      }, 600); // delay para parecer mais natural
      return () => clearTimeout(timeout);
    }
  }, [mode, player, winner, skipTurn, computerMove]);

  // Limpar fallingCell após animação (~450ms)
  React.useEffect(() => {
    if (fallingCell) {
      const timeout = setTimeout(() => setFallingCell(null), 450);
      return () => clearTimeout(timeout);
    }
  }, [fallingCell]);

  // Efeito para iniciar o temporizador ao carregar o componente
  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // Efeito para lidar com a lógica de pular a vez
  useEffect(() => {
    if (skipTurn && !winner) {
      setSkipTurn(false);
      nextPlayer();
      restartTimer();
    }
  }, [skipTurn, winner]);

  // Efeito para mostrar mensagem de tempo esgotado e só depois passar a vez
  useEffect(() => {
    if (showTimeoutMsg && !winner) {
      const timeout = setTimeout(() => {
        setShowTimeoutMsg(false);
        setSkipTurn(true); // só depois do aviso passa a vez
      }, 2000); // intervalo aumentado para 2s
      return () => clearTimeout(timeout);
    }
  }, [showTimeoutMsg, winner]);

  // Chamar onGameEnd quando houver vencedor (para atualizar o score)
  useEffect(() => {
    if (winner && winner !== "Empate" && onGameEnd) {
      onGameEnd(winner, mode);
    }
    // eslint-disable-next-line
  }, [winner]);

  // Renderiza o componente
  return (
    <div className="game-container">
      <h1>4 em Linha Especial</h1>
      {/* ScoreBoard mostra o score atual */}
      <ScoreBoard score={score} mode={mode} playerNames={playerNames} />
      <p>
        {winner
          ? winner === "Empate"
            ? "O jogo terminou em empate!"
            : mode === "cpu" && winner === 2
            ? `${playerNames?.player2 || "Computador"} venceu!`
            : `${winner === 1 ? playerNames?.player1 : playerNames?.player2} venceu!`
          : mode === "cpu"
          ? player === 1
            ? `A tua vez!`
            : `Vez do ${playerNames?.player2 || "Computador"}...`
          : `Vez de ${player === 1 ? playerNames?.player1 : playerNames?.player2}`}
      </p>
      {/* Aviso pop-up de tempo esgotado */}
      {showTimeoutMsg && (
        <div className="timeout-popup">
          <span>⏰ Tempo esgotado! A vez vai passar para o próximo jogador...</span>
        </div>
      )}
      {/* Barra de tempo animada */}
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
      {/* Tabuleiro com animações, hover, células especiais e células vencedoras */}
      <Board
        board={board}
        onClick={handleClick}
        specialCells={specialCells}
        fallingCell={fallingCell}
        winningCells={winningCells}
        hoverCol={hoverCol}
        setHoverCol={setHoverCol}
      />
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

// ScoreBoard Component: mostra o score dos jogadores ou do computador
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
