import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota 1: Página Principal (Home) */}
        <Route path="/" element={<Home />} />
        
        {/* Rota 2: Tela de Login e Cadastro */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota 3: Painel do Piloto Logado */}
        <Route path="/painel" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;