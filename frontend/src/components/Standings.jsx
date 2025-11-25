import { useState } from "react";

const Standings = () => {
  // 1. Lista Completa de Categorias
  const categoriesList = [
    "50cc",
    "65cc",
    "Feminino",
    "Free Force One",
    "Importada Amador",
    "Junior",
    "Nacional Amador",
    "Open Importada",
    "Open Nacional",
    "Over 250",
    "Ultimate 250x230",
    "VX 250f Nacional",
    "VX230",
    "VX3 Importada",
    "VX3 Nacional",
    "VX4",
    "VX5",
    "VX6",
    "VX7"
  ];

  // 2. Estados
  const [activeCategory, setActiveCategory] = useState(categoriesList[0]);
  const [pilotSearch, setPilotSearch] = useState("");      // Busca de pilotos
  const [categorySearch, setCategorySearch] = useState(""); // Nova busca de categorias

  // 3. Dados Mockados (Falsos)
  const data = {
    "50cc": [
        { pos: 1, name: "Pedrinho Silva", number: 10, team: "Kids Racing", points: 50 },
        { pos: 2, name: "Lucas M.", number: 5, team: "MX School", points: 44 }
    ],
    "65cc": [],
    "Feminino": [
        { pos: 1, name: "Ana Souza", number: 22, team: "Girls MX", points: 47 },
        { pos: 2, name: "Carla Dias", number: 101, team: "Privado", points: 40 }
    ],
    "Free Force One": [],
    "Importada Amador": [
        { pos: 1, name: "Carlos 'Danger'", number: 7, team: "Honda Racing", points: 50 }
    ],
    "Junior": [],
    "Nacional Amador": [],
    "Open Importada": [],
    "Open Nacional": [],
    "Over 250": [],
    "Ultimate 250x230": [],
    "VX 250f Nacional": [],
    "VX230": [],
    "VX3 Importada": [],
    "VX3 Nacional": [],
    "VX4": [],
    "VX5": [],
    "VX6": [],
    "VX7": []
  };

  // --- LÓGICA DE FILTROS ---

  // A. Filtrar os BOTÕES das categorias baseado no que foi digitado
  const visibleCategories = categoriesList.filter((cat) => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // B. Filtrar os PILOTOS da categoria ativa
  const currentCategoryData = data[activeCategory] || [];
  const filteredPilots = currentCategoryData.filter((pilot) => 
    pilot.name.toLowerCase().includes(pilotSearch.toLowerCase()) || 
    pilot.number.toString().includes(pilotSearch)
  );

  return (
    <section className="bg-[#0a0a0a] py-10 text-white border-t border-gray-900 mt-10">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho da Seção */}
        <div className="mb-8 border-l-4 border-[#D80000] pl-4">
          <h2 className="text-3xl font-black italic uppercase">Classificação <span className="text-[#D80000]">Geral</span></h2>
          <p className="text-gray-400 text-sm">Selecione a categoria abaixo para ver o ranking.</p>
        </div>

        {/* --- ÁREA DE SELEÇÃO DE CATEGORIA --- */}
        <div className="flex flex-col gap-4 mb-8">
          
          {/* Input para filtrar os botões das categorias */}
          <div className="w-full md:w-1/3">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
               Encontrar Categoria:
             </label>
             <input
              type="text"
              placeholder="Ex: VX, 50cc, Open..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-800 text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-[#D80000] transition"
            />
          </div>

          {/* Lista de Botões (Com Scroll Horizontal) */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide border-b border-gray-900">
            <div className="flex gap-2 min-w-max">
              {visibleCategories.length > 0 ? (
                visibleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 font-bold italic text-sm uppercase rounded skew-x-[-10deg] transition-all duration-300 border border-[#D80000] whitespace-nowrap
                      ${activeCategory === cat 
                        ? "bg-[#D80000] text-white shadow-[0_0_10px_rgba(216,0,0,0.5)] scale-105" 
                        : "bg-transparent text-gray-400 hover:text-white hover:border-white"
                      }`}
                  >
                    <span className="skew-x-[10deg] inline-block">{cat}</span>
                  </button>
                ))
              ) : (
                <span className="text-gray-500 italic py-2">Nenhuma categoria encontrada.</span>
              )}
            </div>
          </div>
        </div>

        {/* --- ÁREA DE PESQUISA DE PILOTO --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
            <div>
                <h3 className="text-2xl font-bold italic uppercase text-[#D80000]">
                    {activeCategory}
                </h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Categoria Selecionada</span>
            </div>

            <div className="w-full md:w-1/3 relative">
                <input
                type="text"
                placeholder={`Buscar piloto em ${activeCategory}...`}
                value={pilotSearch}
                onChange={(e) => setPilotSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-500"
                />
            </div>
        </div>

        {/* --- TABELA DE RESULTADOS --- */}
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 shadow-xl min-h-[200px]">
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
                    <td className="p-4 font-medium uppercase">
                      {pilot.name}
                    </td>
                    <td className="p-4 text-gray-500 hidden md:table-cell text-sm uppercase">
                      {pilot.team}
                    </td>
                    <td className="p-4 text-center font-black text-xl text-white">
                      {pilot.points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500 italic">
                    <p className="mb-2">Nenhum piloto encontrado.</p>
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