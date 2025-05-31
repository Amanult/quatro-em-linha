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
export default function Game({ onBackToStart }) {
  // Estados para armazenar o tabuleiro, jogador atual, vencedor, células especiais, etc.
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [specialCells, setSpecialCells] = useState(generateSpecialCells());
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null); // Referência para o temporizador
  const [skipTurn, setSkipTurn] = useState(false);

  // Função para reiniciar o jogo
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setPlayer(1);
    setWinner(null);
    setSpecialCells(generateSpecialCells());
    setTimer(0);
    setSkipTurn(false);
    restartTimer();
  };

  // Verifica se uma célula é especial
  const isSpecial = (row, col) => specialCells.includes(`${row},${col}`);

  // Função para verificar se há um vencedor
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
        if (!current) continue; // Ignora células vazias
        for (let [dr, dc] of directions) {
          let count = 1;
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
            count++;
          }
          if (count === 4) return current; // Retorna o jogador vencedor
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
          setSkipTurn(true); // Pula a vez do jogador se o tempo acabar
          return MAX_TIME;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Lida com o clique em uma coluna
  const handleClick = (col) => {
    if (winner || skipTurn) return; // Ignora cliques se houver vencedor ou se for para pular a vez
    const newBoard = board.map((row) => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        setBoard(newBoard);
        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win); // Define o vencedor
          clearInterval(timerRef.current);
          return;
        }
        if (isBoardFull(newBoard)) {
          setWinner("Empate"); // Define empate se o tabuleiro estiver cheio
          clearInterval(timerRef.current);
          return;
        }
        if (!isSpecial(row, col)) {
          nextPlayer(); // Alterna para o próximo jogador se a célula não for especial
        }
        restartTimer();
        return;
      }
    }
  };

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

  // Renderiza o componente
  return (
    <div className="game-container">
      <h1>4 em Linha Especial</h1>
      <p>
        {winner
          ? winner === "Empate"
            ? "O jogo terminou em empate!"
            : `Jogador ${winner} venceu!`
          : `Vez do Jogador ${player}`}
      </p>
      <p>Tempo: {timer}s</p>
      <Board board={board} onClick={handleClick} specialCells={specialCells} />
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
