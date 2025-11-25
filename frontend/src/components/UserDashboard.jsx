import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Trophy, Calendar, MapPin, CreditCard, Clock } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Visitante", bike_number: "00", id: null });
  const [nextEvent, setNextEvent] = useState(null);
  
  // Estados novos
  const [myRegistrations, setMyRegistrations] = useState([]); // Lista real do banco
  const [selectedOption, setSelectedOption] = useState("1_cat");
  const [currentPrice, setCurrentPrice] = useState(130);

  const prices = {
    "50cc": 80.00, "Feminino": 80.00, "65cc": 130.00,
    "65cc_50cc": 170.00, "1_cat": 130.00, "2_cat": 200.00, "full_pass": 230.00
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setCurrentPrice(prices[e.target.value]);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchEvents();
      fetchMyRegistrations(userData.id); // <--- Busca o histórico real assim que loga
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events');
      const data = await response.json();
      if (data.length > 0) setNextEvent(data[0]);
    } catch (error) { console.error("Erro eventos:", error); }
  };

  // NOVA FUNÇÃO: Buscar inscrições do usuário
  const fetchMyRegistrations = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/my-registrations/${userId}`);
      const data = await response.json();
      setMyRegistrations(data);
    } catch (error) { console.error("Erro inscrições:", error); }
  };

  const handleSubscribe = async () => {
    if (!nextEvent || !user.id) return;

    const categoryNames = {
      "50cc": "50cc", "Feminino": "Feminino", "65cc": "65cc", 
      "65cc_50cc": "Combo 65cc + 50cc", "1_cat": "1 Categoria Adulto",
      "2_cat": "2 Categorias Adulto", "full_pass": "Passaport Full Pass"
    };

    try {
      const response = await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          event_id: nextEvent.id,
          category: categoryNames[selectedOption]
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`🏁 Inscrição Confirmada!\nCategoria: ${categoryNames[selectedOption]}`);
        fetchMyRegistrations(user.id); // <--- Atualiza a lista na hora!
      } else {
        alert("⚠️ " + result.error);
      }
    } catch (error) {
      alert("Erro ao processar inscrição.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
          <div>
            <h2 className="text-3xl font-black italic uppercase">Painel do <span className="text-[#D80000]">Piloto</span></h2>
            <p className="text-gray-400">
              Bem-vindo, <strong className="text-white">{user.name}</strong>. #{user.bike_number}
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <span className="text-sm text-gray-500 uppercase block">Inscrições Ativas</span>
            <span className="text-4xl font-black text-[#D80000]">{myRegistrations.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- MINHAS INSCRIÇÕES (REAL) --- */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 uppercase">
              <Trophy className="text-[#D80000]" /> Minhas Corridas
            </h3>
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-[#2a2a2a] text-gray-400 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Evento</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {myRegistrations.length > 0 ? (
                    myRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-800 transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{reg.event}</div>
                          <div className="text-xs text-gray-500">{reg.date}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-300 bg-gray-900/50 rounded">{reg.category}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-900 text-green-300 border border-green-700 uppercase tracking-wide">
                            <Clock className="w-3 h-3" /> Confirmado
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500 italic">
                        Você ainda não se inscreveu em nenhuma corrida.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- Próximo Desafio (Card de Compra) --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 uppercase">
               Próximo Desafio
            </h3>

            {nextEvent ? (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-gray-900 border-2 border-[#D80000] rounded-xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(216,0,0,0.2)]">
                <div className="absolute top-0 right-0 bg-[#D80000] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  1º LOTE ABERTO
                </div>

                <h4 className="text-2xl font-black italic uppercase mb-2">{nextEvent.title}</h4>
                
                <div className="space-y-3 text-sm text-gray-400 mb-6">
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {nextEvent.date}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {nextEvent.location}</p>
                </div>

                <div className="mb-6">
                  <span className="text-sm text-gray-500 uppercase block mb-1">Selecione seu Plano:</span>
                  <select 
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-2 rounded focus:border-[#D80000] outline-none text-sm"
                  >
                    <option value="50cc">50cc (R$ 80,00)</option>
                    <option value="Feminino">Feminino (R$ 80,00)</option>
                    <option value="65cc">65cc (R$ 130,00)</option>
                    <option value="65cc_50cc">Combo 65cc + 50cc (R$ 170,00)</option>
                    <option value="1_cat">1 Categoria Adulto (R$ 130,00)</option>
                    <option value="2_cat">2 Categorias Adulto (R$ 200,00)</option>
                    <option value="full_pass">Passaport Full Pass (R$ 230,00)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between mb-4 bg-[#0a0a0a] p-3 rounded border border-gray-800">
                   <span className="text-gray-400 text-sm">Total a pagar:</span>
                   <span className="text-xl font-black text-[#D80000]">R$ {currentPrice},00</span>
                </div>

                <button 
                  onClick={handleSubscribe}
                  className="w-full bg-[#D80000] hover:bg-red-700 text-white font-bold py-3 rounded uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1"
                >
                   <CreditCard className="w-5 h-5" /> Pagar Agora
                </button>
              </div>
            ) : (
              <div className="p-6 bg-[#1a1a1a] rounded border border-gray-800 text-center text-gray-500">
                Nenhum evento aberto no momento.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;