import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import EventCard from "./EventCard";
import Standings from "./Standings";

const Home = () => {
  const [events, setEvents] = useState([]);

  // Busca os eventos reais do Backend ao carregar a página
  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Erro ao buscar eventos:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D80000] selection:text-white flex flex-col">
      <Navbar />

      {/* --- HERO SECTION (Banner) --- */}
      <div className="relative bg-[#0a0a0a] border-b-4 border-[#D80000] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="../../public/bgTamura.jpeg" 
            className="w-full h-full object-cover grayscale" 
            alt="Fundo Motocross"
           />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80"></div>
        
        <div className="relative z-20 container mx-auto px-4 py-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-lg">
            Acelere para a <span className="text-[#D80000]">Glória</span>
          </h2>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium shadow-black drop-shadow-md">
            O sistema oficial de inscrições da Tamura Eventos. 
            Garanta seu gate nas melhores pistas de Velocross da região.
          </p>
          
          <Link to="/login">
            <button className="bg-[#D80000] hover:bg-red-700 text-white px-8 py-4 rounded font-black uppercase text-lg tracking-widest transition-transform hover:-translate-y-1 shadow-[0_4px_0_rgb(100,0,0)] hover:shadow-[0_2px_0_rgb(100,0,0)] active:shadow-none active:translate-y-0">
              Quero Correr
            </button>
          </Link>
        </div>
      </div>

      {/* --- LISTA DE EVENTOS (AGORA REAIS) --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-2 h-10 bg-[#D80000]"></div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-wide">
            Próximas <span className="text-[#D80000]">Etapas</span>
          </h3>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              // Envolvemos o Card em um Link para levar ao login/painel ao clicar
              <Link to="/login" key={event.id} className="block">
                <EventCard 
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  price={event.price} // Mostra o preço base
                  image={event.image}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1a1a1a] rounded border border-gray-800">
            <p className="text-gray-500 text-xl italic">Carregando eventos ou aguardando divulgação...</p>
          </div>
        )}
      </div>
      
      {/* --- CLASSIFICAÇÃO --- */}
      <div id="classificacao" className="scroll-mt-20">
         <Standings />
      </div>

      {/* Espaço no final */}
      <div className="pb-20"></div>
    </div>
  );
};

export default Home;