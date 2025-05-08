import React from "react";
import "./Cell.css"; // Importa o estilo da célula

// Componente que representa uma célula individual no tabuleiro
export default function Cell({ value, onClick, isSpecial }) {
  // Função para determinar a classe de cor com base no valor da célula
  const getColorClass = () => {
    if (value === 1) return "red"; // Jogador 1 (vermelho)
    if (value === 2) return "yellow"; // Jogador 2 (amarelo)
    return "empty"; // Célula vazia
  };

  return (
    <div
      className={`cell ${getColorClass()} ${isSpecial ? "special" : ""}`} // Define as classes CSS
      onClick={onClick} // Define a função de clique
    ></div>
  );
}
