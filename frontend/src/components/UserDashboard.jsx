import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Standings from "./Standings"; // A tabela nova com filtros
import { Calendar, MapPin, PlusCircle, CheckCircle, Trophy, Flag } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stages, setStages] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchData(userData.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (userId) => {
    try {
      // Busca etapas reais do banco
      const stagesRes = await fetch('http://localhost:3000/api/stages');
      const stagesData = await stagesRes.json();
      setStages(stagesData);

      // Busca inscrições deste usuário
      const myRegRes = await fetch(`http://localhost:3000/api/registrations/user/${userId}`);
      const myRegData = await myRegRes.json();
      setMyRegistrations(myRegData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          
          {/* 1. CABEÇALHO DO PILOTO (Restaurado) */}
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-8">
            <div>
              <span className="text-[#D80000] font-bold tracking-widest text-sm uppercase mb-2 block">Área do Piloto</span>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Olá, <span className="text-white">{user.name}</span>
              </h1>
            </div>
            <div className="mt-6 md:mt-0 bg-[#111] px-6 py-3 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="bg-[#D80000] w-2 h-2 rounded-full animate-pulse"></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Moto Nº</p>
                <p className="text-xl font-black italic">{user.bike_number || "00"}</p>
              </div>
            </div>
          </div>

          {/* 2. SEÇÃO DE ETAPAS (Cards Restaurados) */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
               <Flag size={32} className="text-[#D80000]" />
               <h2 className="text-3xl font-black uppercase italic">Etapas <span className="text-[#D80000]">Abertas</span></h2>
            </div>

            {stages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stages.map((stage) => {
                  // Verifica se já está inscrito
                  const isRegistered = myRegistrations.some(r => r.stage_id === stage.id);

                  return (
                    <div key={stage.id} className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#D80000] transition-all duration-300 group shadow-lg">
                      
                      {/* Imagem/Banner da Etapa */}
                      <div className="h-40 bg-neutral-900 relative">
                          {/* Certifique-se de que bgEvent.jpg está na pasta public */}
                          <div className="absolute inset-0 bg-[url('/bgEvent.jpg')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                          <div className="absolute bottom-4 left-6">
                             <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${isRegistered ? 'bg-green-900/80 border-green-500 text-green-400' : 'bg-[#D80000] border-[#D80000] text-white'}`}>
                                {isRegistered ? 'Inscrito' : 'Inscrições Abertas'}
                             </span>
                          </div>
                      </div>

                      <div className="p-8">
                        <h3 className="text-2xl font-black italic uppercase text-white mb-2">{stage.name}</h3>
                        
                        <div className="space-y-3 mb-8 text-sm text-gray-400">
                          <p className="flex items-center gap-3"><Calendar size={16} className="text-[#D80000]"/> {new Date(stage.date).toLocaleDateString('pt-BR')}</p>
                          <p className="flex items-center gap-3"><MapPin size={16} className="text-[#D80000]"/> {stage.location}</p>
                        </div>

                        {isRegistered ? (
                          <button disabled className="w-full bg-green-900/20 text-green-500 border border-green-900/50 font-bold py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-default">
                            <CheckCircle size={20} /> Presença Confirmada
                          </button>
                        ) : (
                          <Link to={`/event/${stage.id}/register`}>
                            <button className="w-full bg-white text-black hover:bg-[#D80000] hover:text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-red-900/20 hover:-translate-y-1">
                              <PlusCircle size={20} /> Inscrever-se
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 bg-[#111] border border-dashed border-gray-800 rounded-2xl text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma etapa disponível para inscrição no momento.</p>
              </div>
            )}
          </section>

          {/* 3. SEÇÃO DE CLASSIFICAÇÃO (Mantida a nova funcionalidade) */}
          <section>
            <div className="flex items-center gap-4 mb-10">
               {/* Este título pode parecer duplicado com o do componente Standings. 
                   Se quiser, pode remover esta div inteira. */}
               <Trophy size={32} className="text-[#D80000]" />
               <h2 className="text-3xl font-black uppercase italic">Classificação <span className="text-[#D80000]">Campeonato</span></h2>
            </div>
            
            {/* O componente Standings novo, com filtro de etapas */}
            <Standings />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;