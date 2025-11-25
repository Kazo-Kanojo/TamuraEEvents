import { useState } from "react";
import { Link } from "react-router-dom"; // <--- ESTE IMPORT É OBRIGATÓRIO
import logoTamura from '../assets/logoTamura.jpg'; // Verifique se o caminho da imagem está certo

const Navbar = () => {
  return (
    <nav className="bg-[#0a0a0a] text-white shadow-xl border-b-2 border-[#D80000]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
        
        {/* --- LOGO (Agora com Link para Home) --- */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer flex-shrink-0">
          <img 
            src={logoTamura} 
            alt="Tamura Eventos Logo" 
            className="h-12 w-auto object-contain hover:scale-105 transition duration-300" 
          />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase hidden lg:block">
            Tamura <span className="text-[#D80000]">Eventos</span>
          </h1>
        </Link>

        {/* --- LINKS CENTRAIS --- */}
        <ul className="hidden md:flex gap-6 font-bold text-sm tracking-wide uppercase whitespace-nowrap">
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Classificação
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Calendário
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Sobre Nós
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Contato
          </li>
        </ul>

        {/* --- BOTÕES (Com Links funcionando) --- */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/login">
            <button className="hidden md:block font-bold text-sm hover:text-[#D80000] transition">
              LOGIN
            </button>
          </Link>
          
          <Link to="/login"> 
            <button className="bg-[#D80000] hover:bg-red-700 text-white px-6 py-2 rounded font-black uppercase text-xs tracking-wider transition-transform hover:-translate-y-1 shadow-[0_4px_0_rgb(150,0,0)] hover:shadow-[0_2px_0_rgb(150,0,0)] active:shadow-none active:translate-y-0">
              CADASTRAR
            </button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;