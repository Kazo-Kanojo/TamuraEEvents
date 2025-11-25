import Navbar from "./components/Navbar";
import Standings from "./components/Standings.jsx";
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Aqui entra nossa Navbar */}
      <Navbar />

      {/* Área de conteúdo principal (Hero Section) */}
      <main className="p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mt-10">
          Próxima Etapa: Ibiúna
        </h2>
        <p className="text-gray-600 mt-2">
          Garanta sua vaga no gate antes que acabe!
        </p>
        
        {/* Faremos a lista de corridas aqui em breve */}
        <div className="mt-10 border-2 border-dashed border-gray-300 p-10 rounded-lg">
          [Aqui entrarão os Cards dos Eventos]
        </div>
        <Standings></Standings>
      </main>
    </div>
  )
}

export default App
