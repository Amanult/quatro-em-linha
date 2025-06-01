import React from "react"; // Importa React
import Cell from "./Cell"; // Importa o componente de célula
import "./Board.css"; // Importa o CSS do tabuleiro

// Componente funcional que representa o tabuleiro do jogo
export default function Board({
  board, // Matriz com o estado do tabuleiro
  onClick, // Função chamada ao clicar numa coluna
  specialCells, // Array de células especiais
  fallingCell, // Célula que está a "cair" (para animação)
  winningCells = [], // Células vencedoras (para animação)
  hoverCol, // Coluna atualmente em hover
  setHoverCol, // Função para atualizar a coluna em hover
}) {
  // Renderiza o tabuleiro como uma grelha de células
  return (
    <div
      className="board"
      onMouseLeave={() => setHoverCol && setHoverCol(null)} // Limpa hover ao sair do tabuleiro
    >
      {/* Renderiza cada célula do tabuleiro */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`} // Chave única para cada célula
            value={cell} // Valor da célula (1, 2 ou null)
            onClick={() => onClick(colIndex)} // Ao clicar, chama onClick com o índice da coluna
            isSpecial={specialCells.includes(`${rowIndex},${colIndex}`)} // Indica se é célula especial
            falling={
              fallingCell &&
              fallingCell.row === rowIndex &&
              fallingCell.col === colIndex
            } // Ativa animação de queda
            isWinning={winningCells.some(
              ([r, c]) => r === rowIndex && c === colIndex
            )} // Ativa animação de vitória
            isHover={
              hoverCol === colIndex &&
              rowIndex === firstEmptyRow(board, colIndex)
            } // Ativa efeito de hover na célula correta
            onMouseEnter={() => setHoverCol && setHoverCol(colIndex)} // Atualiza coluna em hover ao passar o rato
          />
        ))
      )}
    </div>
  );
}

// Função auxiliar para encontrar a primeira linha vazia de uma coluna
function firstEmptyRow(board, col) {
  for (let row = board.length - 1; row >= 0; row--) {
    if (!board[row][col]) return row;
  }
  return -1;
}
