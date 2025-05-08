import React from "react";
import "./Cell.css";

export default function Cell({ value, onClick, isSpecial }) {
  const getColorClass = () => {
    if (value === 1) return "red";
    if (value === 2) return "yellow";
    return "empty";
  };

  return (
    <div
      className={`cell ${getColorClass()} ${isSpecial ? "special" : ""}`}
      onClick={onClick}
    ></div>
  );
}
