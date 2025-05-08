import React, { useEffect, useState, useRef } from 'react';
import Board from './Board';
import './Game.css';

const ROWS = 6;
const COLS = 7;
const MAX_TIME = 10;

const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const generateSpecialCells = () => {
  const specials = new Set();
  while (specials.size < 5) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    specials.add(`${row},${col}`);
  }
  return Array.from(specials);
};

export default function Game() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const [specialCells, setSpecialCells] = useState(generateSpecialCells());
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [skipTurn, setSkipTurn] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [dropInfo, setDropInfo] = useState(null);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setPlayer(1);
    setWinner(null);
    setSpecialCells(generateSpecialCells());
    setTimer(0);
    setSkipTurn(false);
    setDropping(false);
    setDropInfo(null);
    restartTimer();
  };

  const isSpecial = (row, col) => specialCells.includes(`${row},${col}`);

  const checkWinner = (board) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const current = board[r][c];
        if (!current) continue;
        for (let [dr, dc] of directions) {
          let count = 1;
          for (let i = 1; i < 4; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== current) break;
            count++;
          }
          if (count === 4) return current;
        }
      }
    }
    return null;
  };

  const nextPlayer = () => setPlayer(player === 1 ? 2 : 1);

  const restartTimer = () => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev + 1 >= MAX_TIME) {
          clearInterval(timerRef.current);
          setSkipTurn(true);
          return MAX_TIME;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleClick = (col) => {
    if (winner || skipTurn || dropping) return;
    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        setDropping(true);
        setDropInfo({ row, col, currentPlayer: player });
        return;
      }
    }
  };

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (skipTurn && !winner) {
      setSkipTurn(false);
      nextPlayer();
      restartTimer();
    }
  }, [skipTurn, winner]);

  useEffect(() => {
    if (dropInfo) {
      let r = 0;
      const dropInterval = setInterval(() => {
        setBoard(prev => {
          const temp = prev.map(row => [...row]);
          if (r > 0 && r < ROWS) temp[r - 1][dropInfo.col] = null;
          if (r < ROWS) temp[r][dropInfo.col] = dropInfo.currentPlayer;
          return temp;
        });

        if (r === dropInfo.row) {
          clearInterval(dropInterval);

          const finalBoard = board.map(row => [...row]);
          finalBoard[dropInfo.row][dropInfo.col] = dropInfo.currentPlayer;
          const win = checkWinner(finalBoard);

          if (win) {
            setWinner(win);
            clearInterval(timerRef.current);
          } else {
            if (!isSpecial(dropInfo.row, dropInfo.col)) {
              nextPlayer();
            }
            restartTimer();
          }

          setDropping(false);
          setDropInfo(null);
        }

        r++;
      }, 100);
    }
  }, [dropInfo]);

  return (
    <div className="game-container">
      <h1>4 em Linha Especial</h1>
      <p>{winner ? `Jogador ${winner} venceu!` : `Vez do Jogador ${player}`}</p>
      <p>Tempo: {timer}s</p>
      <Board board={board} onClick={handleClick} specialCells={specialCells} />
      {winner && <button className="reset-button" onClick={resetGame}>Jogar Novamente</button>}
    </div>
  );
}