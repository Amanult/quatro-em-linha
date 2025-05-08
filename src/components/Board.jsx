import React from "react";
import Cell from "./Cell";
import "./Board.css";

export default function Board({ board, onClick, specialCells }) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            onClick={() => onClick(colIndex)}
            isSpecial={specialCells.includes(`${rowIndex},${colIndex}`)}
          />
        ))
      )}
    </div>
  );
}
