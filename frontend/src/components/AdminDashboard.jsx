import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Users, MapPin, Calendar, LogOut, DollarSign, Trophy, Save } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pilots, setPilots] = useState([]); // Lista de pilotos para pontuação

  const PRECOS_FIXOS = ["80", "100", "120", "150", "200"]; 

  const [newEvent, setNewEvent] = useState({
    title: "", date: "", location: "", price: "", image: ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      alert("Acesso restrito ao Chefe Tamura!");
      navigate("/login");
    } else {
      fetchEvents();
      fetchRegistrations();
      fetchPilots(); // Busca os pilotos ao carregar
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3000/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) { console.error(error); }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (error) { console.error(error); }
  };

  // --- BUSCAR PILOTOS ---
  const fetchPilots = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/users");
      const data = await res.json();
      setPilots(data);
    } catch (error) { console.error(error); }
  };

  // --- ATUALIZAR PONTOS/POSIÇÃO ---
  const handleUpdatePilot = async (pilotId, newScore, newPosition) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/users/${pilotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore, position: newPosition }),
      });

      if (res.ok) {
        alert("Classificação atualizada!");
        fetchPilots(); // Recarrega para ordenar
      }
    } catch (error) {
      console.error("Erro ao atualizar", error);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      
      if (res.ok) {
        alert("Evento criado com sucesso!");
        setNewEvent({ title: "", date: "", location: "", price: "", image: "" });
        fetchEvents(); 
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm("Tem certeza?")) return;
    try {
      await fetch(`http://localhost:3000/admin/events/${id}`, { method: "DELETE" });
      fetchEvents();
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic text-[#D80000] uppercase">Painel Admin</h1>
          <p className="text-gray-400 text-sm">Controle total do campeonato.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <LogOut size={20} /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* COLUNA 1: EVENTOS (Criar e Listar) */}
        <div className="space-y-8">
          {/* Form Criar */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PlusCircle className="text-[#D80000]" /> Novo Evento
            </h2>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <input type="text" placeholder="Nome do Evento" className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white focus:border-[#D80000] outline-none" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
              <div className="flex gap-2">
                <input type="date" className="w-1/2 bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white focus:border-[#D80000] outline-none" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
                <div className="relative w-1/2">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <select className="w-full bg-[#0a0a0a] border border-gray-700 p-2 pl-8 rounded text-white focus:border-[#D80000] outline-none appearance-none" value={newEvent.price} onChange={(e) => setNewEvent({...newEvent, price: e.target.value})} required>
                    <option value="" disabled>Valor</option>
                    {PRECOS_FIXOS.map(v => <option key={v} value={v}>{v},00</option>)}
                  </select>
                </div>
              </div>
              <input type="text" placeholder="Localização" className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white focus:border-[#D80000] outline-none" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} required />
              <input type="text" placeholder="URL da Imagem" className="w-full bg-[#0a0a0a] border border-gray-700 p-2 rounded text-white focus:border-[#D80000] outline-none" value={newEvent.image} onChange={(e) => setNewEvent({...newEvent, image: e.target.value})} />
              <button type="submit" className="w-full bg-[#D80000] hover:bg-red-700 text-white font-bold py-2 rounded uppercase text-sm">Publicar</button>
            </form>
          </div>

          {/* Lista Eventos */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-[#D80000]" /> Eventos Ativos
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {events.map(event => (
                <div key={event.id} className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded border border-gray-800">
                  <div>
                    <h4 className="font-bold text-sm text-white">{event.title}</h4>
                    <div className="flex gap-2 text-xs text-gray-400">
                      <span>{event.date}</span>
                      <span className="text-[#D80000] font-bold">R$ {event.price}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA 2: CLASSIFICAÇÃO (Pontos e Posição) - NOVO! */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-[#D80000]" /> Classificação Geral
          </h2>
          <p className="text-xs text-gray-400 mb-4">Edite a posição e pontuação dos pilotos.</p>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {pilots.length === 0 && <p className="text-gray-500 text-sm">Nenhum piloto cadastrado.</p>}
            
            {pilots.map((pilot) => (
              <div key={pilot.id} className="bg-[#0a0a0a] p-3 rounded border border-gray-800 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{pilot.name} <span className="text-gray-500">#{pilot.bike_number}</span></span>
                </div>
                
                {/* Inputs de Edição */}
                <form 
                  className="flex gap-2 items-end"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const score = e.target.score.value;
                    const pos = e.target.pos.value;
                    handleUpdatePilot(pilot.id, score, pos);
                  }}
                >
                  <div className="w-1/3">
                    <label className="text-[10px] text-gray-500 uppercase block">Posição</label>
                    <input name="pos" type="number" defaultValue={pilot.position} className="w-full bg-[#1a1a1a] border border-gray-700 text-center text-white p-1 rounded focus:border-[#D80000] outline-none text-sm" />
                  </div>
                  <div className="w-1/3">
                    <label className="text-[10px] text-gray-500 uppercase block">Pontos</label>
                    <input name="score" type="number" defaultValue={pilot.score} className="w-full bg-[#1a1a1a] border border-gray-700 text-center text-white p-1 rounded focus:border-[#D80000] outline-none text-sm" />
                  </div>
                  <button type="submit" className="bg-[#D80000] hover:bg-red-700 p-1.5 rounded text-white transition h-fit mb-0.5">
                    <Save size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA 3: ÚLTIMAS INSCRIÇÕES */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="text-[#D80000]" /> Inscrições Recentes
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {registrations.length === 0 && <p className="text-gray-500 text-sm">Nenhuma inscrição.</p>}
            {registrations.map((reg) => (
              <div key={reg.id} className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded border-l-2 border-[#D80000]">
                <div>
                  <p className="font-bold text-white text-sm">{reg.piloto} <span className="text-gray-500 text-xs">#{reg.bike_number}</span></p>
                  <p className="text-[10px] text-gray-400">{reg.evento} • {reg.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;