import React from "react";
import Game from "./components/Game"; // Importa o componente do jogo

// Componente principal da aplicação
export default function App() {
  return (
    <div className="app-container">
      {" "}
      {/* Define um contêiner para o jogo */}
      <Game /> {/* Renderiza o componente do jogo */}
    </div>
  );
}
