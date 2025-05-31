import React from "react";
import Cell from "./Cell"; // Importa o componente de célula
import "./Board.css"; // Importa o estilo do tabuleiro

// Componente que representa o tabuleiro do jogo
export default function Board({
  board,
  onClick,
  specialCells,
  fallingCell,
  winningCells = [],
  hoverCol,
  setHoverCol,
}) {
  return (
    <div
      className="board"
      onMouseLeave={() => setHoverCol && setHoverCol(null)} // Limpa hover ao sair do tabuleiro
    >
      {/* Renderiza cada célula do tabuleiro */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`} // Define uma chave única para cada célula
            value={cell} // Passa o valor da célula (1, 2 ou null)
            onClick={() => onClick(colIndex)} // Define a função de clique para a coluna
            isSpecial={specialCells.includes(`${rowIndex},${colIndex}`)} // Verifica se a célula é especial
            falling={fallingCell && fallingCell.row === rowIndex && fallingCell.col === colIndex} // Ativa animação de queda
            isWinning={winningCells.some(([r, c]) => r === rowIndex && c === colIndex)} // Ativa animação de vitória
            isHover={hoverCol === colIndex && rowIndex === firstEmptyRow(board, colIndex)} // Ativa efeito de hover na célula correta
            onMouseEnter={() => setHoverCol && setHoverCol(colIndex)} // Atualiza coluna em hover
          />
        ))
      )}
    </div>
  );
}

// Helper para encontrar a primeira linha vazia de uma coluna
function firstEmptyRow(board, col) {
  for (let row = board.length - 1; row >= 0; row--) {
    if (!board[row][col]) return row;
  }
  return -1;
}
