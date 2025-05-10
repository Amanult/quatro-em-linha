import React from "react";
import "./StartScreen.css"; // Importa os estilos da tela inicial

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Bem-vindo ao 4 em Linha Especial</h1>
      <button onClick={onStart}>Começar Jogo</button>
    </div>
  );
}
