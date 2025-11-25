import Navbar from "./Navbar";

const UserDashboard = () => {
  // Dados falsos do histórico do piloto
  const myRaces = [
    { id: 1, event: "1ª Etapa Copa Ibiúna", category: "VX2", position: "2º Lugar", points: 22, date: "10/02/2025" },
    { id: 2, event: "2ª Etapa Copa Ibiúna", category: "VX2", position: "5º Lugar", points: 16, date: "15/03/2025" },
    { id: 3, event: "Desafio de Verão", category: "Força Livre", position: "1º Lugar", points: 25, date: "20/04/2025" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        
        {/* Cabeçalho do Painel */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-800 pb-6">
          <div>
            <h2 className="text-3xl font-black italic uppercase">Painel do <span className="text-[#D80000]">Piloto</span></h2>
            <p className="text-gray-400">Bem-vindo, <strong>Enzo</strong>. #4</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <span className="text-sm text-gray-500 uppercase block">Pontuação Total</span>
            <span className="text-4xl font-black text-[#D80000]">63 PTS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COLUNA 1: HISTÓRICO (Ocupa 2 espaços) --- */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 uppercase">
              Histórico de Corridas
            </h3>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-[#2a2a2a] text-gray-400 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Evento</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4 text-center">Posição</th>
                    <th className="p-4 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {myRaces.map((race) => (
                    <tr key={race.id} className="hover:bg-gray-800 transition">
                      <td className="p-4">
                        <div className="font-bold">{race.event}</div>
                        <div className="text-xs text-gray-500">{race.date}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-300 bg-gray-900/50 rounded">
                        {race.category}
                      </td>
                      <td className="p-4 text-center font-bold text-[#D80000]">
                        {race.position}
                      </td>
                      <td className="p-4 text-center font-bold">
                        {race.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- COLUNA 2: COMPRAR PRÓXIMA (Ocupa 1 espaço) --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 uppercase">
               Próximo Desafio
            </h3>

            {/* Card de Compra Rápida */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-gray-900 border-2 border-[#D80000] rounded-xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(216,0,0,0.2)]">
              <div className="absolute top-0 right-0 bg-[#D80000] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                INSCRIÇÕES ABERTAS
              </div>

              <h4 className="text-2xl font-black italic uppercase mb-2">3ª Etapa Copa Tamura</h4>
              
              <div className="space-y-3 text-sm text-gray-400 mb-6">
                <p className="flex items-center gap-2">📅 15/12/2025</p>
                <p className="flex items-center gap-2">📍 CT Tamura - Ibiúna/SP</p>
              </div>

              <div className="mb-6">
                <span className="text-sm text-gray-500 uppercase block mb-1">Selecione a Categoria:</span>
                <select className="w-full bg-[#0a0a0a] border border-gray-700 text-white p-2 rounded focus:border-[#D80000] outline-none">
                  <option>VX2 (R$ 100,00)</option>
                  <option>Força Livre (R$ 100,00)</option>
                  <option>Nacional (R$ 80,00)</option>
                </select>
              </div>

              <button className="w-full bg-[#D80000] hover:bg-red-700 text-white font-bold py-3 rounded uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-1">
                 Pagar Inscrição
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;