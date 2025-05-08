import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importa o arquivo CSS global
import App from "./App"; // Importa o componente principal da aplicação
import reportWebVitals from "./reportWebVitals"; // Importa a função para medir desempenho

// Cria a raiz do React e renderiza o componente principal (App) dentro do elemento com id "root"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App /> {/* Renderiza o componente App */}
  </React.StrictMode>
);

// Função opcional para medir o desempenho da aplicação
// Você pode passar uma função para logar os resultados ou enviar para um endpoint de análise
// Exemplo: reportWebVitals(console.log)
reportWebVitals();
