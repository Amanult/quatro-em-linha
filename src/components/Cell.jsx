import React from "react"; // Importa React
import "./Cell.css"; // Importa o CSS da célula

// Componente funcional que representa uma célula individual do tabuleiro
export default function Cell({
  value, // Valor da célula (1, 2 ou null)
  onClick, // Função chamada ao clicar na célula
  isSpecial, // Indica se a célula é especial
  falling, // Ativa animação de queda
  isWinning, // Ativa animação de vitória
  isHover, // Ativa efeito de hover
  onMouseEnter, // Função chamada ao passar o rato sobre a célula
}) {
  // Função auxiliar para determinar a classe de cor com base no valor da célula
  const getColorClass = () => {
    if (value === 1) return "red"; // Jogador 1 (vermelho)
    if (value === 2) return "yellow"; // Jogador 2 (amarelo)
    return "empty"; // Célula vazia
  };

  // Renderiza a célula com as classes e handlers apropriados
  return (
    <div
      className={`cell ${getColorClass()}${isSpecial ? " special" : ""}${
        falling ? " falling" : ""
      }${isWinning ? " winning" : ""}${isHover ? " hover" : ""}`} // Classes CSS para cor, animações e efeitos
      onClick={onClick} // Handler de clique
      onMouseEnter={onMouseEnter} // Handler de mouse enter
    ></div>
  );
}
