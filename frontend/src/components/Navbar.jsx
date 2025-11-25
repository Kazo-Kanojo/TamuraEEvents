import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0a0a0a] text-white shadow-xl border-b-2 border-[#D80000]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <div className="flex items-center gap-3 group cursor-pointer mr-3">
          <div className="w-10 h-10 bg-[#D80000] rounded flex items-center justify-center transform group-hover:skew-x-[-10deg] transition duration-300">
            <span className="font-black text-xl italic text-white">T</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">
            Tamura <span className="text-[#D80000]">Eventos</span>
          </h1>
        </div>

        {/* --- LINKS (Desktop) --- */}
        {/* Atualizado para: Classificação, Calendário, Sobre Nós, Contato */}
        <ul className="hidden md:flex gap-8 font-bold text-sm tracking-wide uppercase">
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Classificação
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Calendário
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Sobre
          </li>
          <li className="hover:text-[#D80000] cursor-pointer transition-colors duration-200">
            Contato
          </li>
        </ul>

        {/* --- BOTÕES --- */}
        <div className="flex items-center gap-4 ml-8">
          <button className="hidden md:block font-bold text-sm hover:text-[#D80000] transition">
            LOGIN
          </button>
          
          <button className="bg-[#D80000] hover:bg-red-700 text-white px-6 py-2 rounded font-black uppercase text-xs tracking-wider transition-transform hover:-translate-y-1 shadow-[0_4px_0_rgb(150,0,0)] hover:shadow-[0_2px_0_rgb(150,0,0)] active:shadow-none active:translate-y-0">
            Minha Conta
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;