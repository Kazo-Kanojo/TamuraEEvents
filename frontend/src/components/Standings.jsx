import { useState } from "react";

const Standings = () => {
  // 1. Estado para controlar qual categoria está na tela
  const [activeCategory, setActiveCategory] = useState("VX1");
  
  // 2. Estado para o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // Dados Mockados (Falsos) para teste
  const data = {
    VX1: [
      { pos: 1, name: "Carlos 'Danger'", number: 101, team: "Honda Racing", points: 50 },
      { pos: 2, name: "João Pedro", number: 72, team: "JP Motos", points: 44 },
      { pos: 3, name: "Matheus Silva", number: 12, team: "Privado", points: 40 },
      { pos: 4, name: "Lucas Rocha", number: 99, team: "Rocha MX", points: 36 },
      { pos: 5, name: "Felipe Zanol", number: 33, team: "KTM Brasil", points: 32 },
    ],
    VX2: [
      { pos: 1, name: "Enzo R.", number: 4, team: "Tamura Team", points: 47 },
      { pos: 2, name: "Bruno C.", number: 22, team: "Yamaha", points: 45 },
      { pos: 3, name: "Gabriel Souza", number: 10, team: "Gabi Racing", points: 38 },
      { pos: 4, name: "Rafael M.", number: 88, team: "Fox Racing", points: 30 },
    ]
  };

  // Lógica de Filtro (Pesquisa)
  const filteredPilots = data[activeCategory].filter((pilot) => 
    pilot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pilot.number.toString().includes(searchTerm)
  );

  return (
    <section className="bg-[#0a0a0a] py-10 text-white border-t border-gray-900">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho da Seção */}
        <div className="mb-8 border-l-4 border-[#D80000] pl-4">
          <h2 className="text-3xl font-black italic uppercase">Classificação <span className="text-[#D80000]">Geral</span></h2>
          <p className="text-gray-400 text-sm">Acompanhe a pontuação atualizada do campeonato.</p>
        </div>

        {/* Controles: Seleção de Categoria e Pesquisa */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Botões das Categorias */}
          <div className="flex gap-2">
            {["VX1", "VX2"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 font-bold italic text-lg rounded skew-x-[-10deg] transition-all duration-300 border border-[#D80000]
                  ${activeCategory === cat 
                    ? "bg-[#D80000] text-white shadow-[0_0_15px_rgba(216,0,0,0.5)]" 
                    : "bg-transparent text-gray-400 hover:text-white hover:border-white"
                  }`}
              >
                <span className="skew-x-[10deg] inline-block">{cat}</span>
              </button>
            ))}
          </div>

          {/* Campo de Pesquisa */}
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Buscar piloto ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-500"
            />
          </div>
        </div>

        {/* Tabela de Resultados */}
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-[#D80000] text-white uppercase text-sm font-black italic">
              <tr>
                <th className="p-4 text-center w-16">Pos</th>
                <th className="p-4 w-16 text-center">#</th>
                <th className="p-4">Piloto</th>
                <th className="p-4 hidden md:table-cell">Equipe</th>
                <th className="p-4 text-center font-bold text-lg">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPilots.length > 0 ? (
                filteredPilots.map((pilot, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition duration-200 group">
                    <td className="p-4 text-center font-bold text-gray-400 group-hover:text-white">
                      {pilot.pos}º
                    </td>
                    <td className="p-4 text-center font-bold text-[#D80000] text-lg italic">
                      {pilot.number}
                    </td>
                    <td className="p-4 font-medium">
                      {pilot.name}
                    </td>
                    <td className="p-4 text-gray-500 hidden md:table-cell text-sm">
                      {pilot.team}
                    </td>
                    <td className="p-4 text-center font-black text-xl text-white">
                      {pilot.points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                    Nenhum piloto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

export default Standings;