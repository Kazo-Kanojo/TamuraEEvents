import Navbar from "./Navbar";
import EventCard from "./EventCard";
import Standings from "./Standings";

const Home = () => {
  // Dados simulados
  const events = [
    {
      id: 1,
      title: "3ª Etapa Copa Tamura",
      date: "15/12/2025 - 08:00",
      location: "CT Tamura - Ibiúna/SP",
      price: "100,00",
      image: "https://images.unsplash.com/photo-1516226276662-31653e0811c4?q=80&w=800&auto=format&fit=crop" 
    },
    {
      id: 2,
      title: "Grande Final Regional",
      date: "20/01/2026 - 08:00",
      location: "Pista do Alemão - Sorocaba/SP",
      price: "120,00",
      image: "https://images.unsplash.com/photo-1568284566453-9bb50b3cb863?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Treino de Verão",
      date: "10/02/2026 - 09:00",
      location: "Arena Velocross",
      price: "50,00",
      image: "https://images.unsplash.com/photo-1532509774891-1400d0d09615?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D80000] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-[#0a0a0a] border-b-4 border-[#D80000] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1599474924187-334a4ae513df?q=80&w=1920&auto=format&fit=crop" 
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
          <button className="bg-[#D80000] hover:bg-red-700 text-white px-8 py-4 rounded font-black uppercase text-lg tracking-widest transition-transform hover:-translate-y-1 shadow-[0_4px_0_rgb(100,0,0)] hover:shadow-[0_2px_0_rgb(100,0,0)] active:shadow-none active:translate-y-0">
            Ver Calendário 2025
          </button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-2 h-10 bg-[#D80000]"></div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-wide">
            Próximas <span className="text-[#D80000]">Etapas</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              price={event.price}
              image={event.image}
            />
          ))}
        </div>
      </div>
      
      {/* Classificação */}
      <Standings />
      <div className="pb-20 bg-[#0a0a0a]"></div>
    </div>
  );
};

export default Home;