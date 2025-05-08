import React from "react";
import Cell from "./Cell"; // Importa o componente de célula
import "./Board.css"; // Importa o estilo do tabuleiro

// Componente que representa o tabuleiro do jogo
export default function Board({ board, onClick, specialCells }) {
  return (
    <div className="board">
      {" "}
      {/* Define o layout do tabuleiro */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`} // Define uma chave única para cada célula
            value={cell} // Passa o valor da célula (1, 2 ou null)
            onClick={() => onClick(colIndex)} // Define a função de clique para a coluna
            isSpecial={specialCells.includes(`${rowIndex},${colIndex}`)} // Verifica se a célula é especial
          />
        ))
      )}
    </div>
  );
}
