import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Calendar, MapPin, Upload, Plus, Edit3, ChevronRight, AlertCircle, CheckCircle, Home, XCircle, Check, ArrowLeft, Trash2, RefreshCw, FileText } from 'lucide-react';

// --- LISTA DE CATEGORIAS ATUALIZADA ---
const VELOCROSS_CATEGORIES = [
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

const AdminDashboard = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('events'); 
  
  // Dados Gerais
  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState({ name: '', location: '', date: '' });
  
  // Seleção e Controle
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadedCategories, setUploadedCategories] = useState([]); 
  
  // Dados da Tabela (Persistência)
  const [categoryResults, setCategoryResults] = useState([]); // Dados da categoria selecionada
  const [isReplacing, setIsReplacing] = useState(false); // Controla se está mostrando a tabela ou o upload

  // UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchStages();
  }, []);

  useEffect(() => {
    if (selectedStage) fetchCategoryStatus(selectedStage.id);
  }, [selectedStage]);

  // Sempre que selecionar uma categoria, tenta buscar os dados dela
  useEffect(() => {
    if (selectedStage && selectedCategory) {
      fetchCategoryResults(selectedStage.id, selectedCategory);
    }
  }, [selectedCategory]);

  // --- API ---

  const fetchStages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stages');
      setStages(await response.json());
    } catch (error) { console.error(error); }
  };

  const fetchCategoryStatus = async (stageId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/stages/${stageId}/categories-status`);
      setUploadedCategories(await response.json());
    } catch (error) { console.error(error); }
  };

  const fetchCategoryResults = async (stageId, category) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/stages/${stageId}/results/${encodeURIComponent(category)}`);
      const data = await response.json();
      
      setCategoryResults(data);
      
      // Se tiver dados, não está em modo de substituição/upload inicial
      if (data.length > 0) {
        setIsReplacing(false);
      } else {
        setIsReplacing(true); // Se não tem dados, vai direto pro upload
      }
    } catch (error) {
      console.error("Erro ao buscar resultados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStage = async (e) => {
    e.preventDefault();
    if (!newStage.name) return showMessage("Preencha o nome", "error");
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStage)
      });
      if (res.ok) {
        showMessage("Evento criado!", "success");
        setNewStage({ name: '', location: '', date: '' });
        fetchStages();
      }
    } catch (error) { showMessage("Erro ao conectar", "error"); } finally { setLoading(false); }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    const url = `http://localhost:3000/api/stages/${selectedStage.id}/upload/${encodeURIComponent(selectedCategory)}`;

    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      const result = await response.json();
      
      if (response.ok) {
        showMessage(`Sucesso! ${selectedCategory} atualizada.`, "success");
        fetchCategoryStatus(selectedStage.id); // Atualiza o card verde
        
        // ATUALIZA A TABELA IMEDIATAMENTE COM OS DADOS DO RETORNO OU BUSCA DE NOVO
        if (result.data) {
            setCategoryResults(result.data);
            setIsReplacing(false); // Sai do modo upload e mostra a tabela
        } else {
            fetchCategoryResults(selectedStage.id, selectedCategory);
        }
      } else {
        showMessage(`Erro: ${result.error}`, "error");
      }
    } catch (error) {
      showMessage("Falha no envio.", "error");
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      
      <header className="bg-neutral-800 border-b border-neutral-700 p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white"><Home size={20} /></button>
            <h1 className="text-xl font-bold text-red-500 uppercase italic border-l-2 border-neutral-600 pl-4">Painel Admin</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('events')} className={`px-3 py-1 rounded text-sm ${activeTab === 'events' ? 'bg-neutral-700 text-white' : 'text-gray-400'}`}>Eventos</button>
            <button onClick={() => setActiveTab('scores')} className={`px-3 py-1 rounded text-sm ${activeTab === 'scores' ? 'bg-red-600 text-white' : 'text-gray-400'}`}>Pontuação</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {message.text && (
          <div className={`fixed top-20 right-6 z-50 px-6 py-3 rounded shadow-lg border-l-4 ${message.type === 'error' ? 'bg-red-900 border-red-500' : 'bg-green-800 border-green-500'} flex gap-2 items-center`}>
            {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {message.text}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 h-min">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="text-red-500" /> Novo Evento</h2>
              <form onSubmit={handleCreateStage} className="space-y-3">
                <input className="w-full bg-neutral-900 border border-neutral-700 rounded p-2" placeholder="Nome" value={newStage.name} onChange={e => setNewStage({...newStage, name: e.target.value})} />
                <input className="w-full bg-neutral-900 border border-neutral-700 rounded p-2" placeholder="Local" value={newStage.location} onChange={e => setNewStage({...newStage, location: e.target.value})} />
                <input type="date" className="w-full bg-neutral-900 border border-neutral-700 rounded p-2" value={newStage.date} onChange={e => setNewStage({...newStage, date: e.target.value})} />
                <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold">{loading ? '...' : 'Criar'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-bold text-gray-200 mb-4">Lista de Eventos</h3>
              <div className="space-y-2">
                {stages.map(stage => (
                  <div key={stage.id} className="p-3 bg-neutral-900/50 rounded flex justify-between items-center border border-neutral-700">
                    <div>
                      <div className="font-bold">{stage.name}</div>
                      <div className="text-xs text-gray-500">{stage.location} - {new Date(stage.date).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <Edit3 size={16} className="text-gray-500 cursor-pointer hover:text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scores' && (
          <div>
            {/* TELA 1: SELECIONAR ETAPA */}
            {!selectedStage && (
              <div className="bg-neutral-800 p-8 rounded-xl border border-neutral-700">
                <h2 className="text-xl font-bold mb-6">Selecione a Etapa</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stages.map(stage => (
                    <button key={stage.id} onClick={() => setSelectedStage(stage)} className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-red-500 text-left group">
                      <div className="text-red-500 text-xs font-bold uppercase">{new Date(stage.date).toLocaleDateString('pt-BR')}</div>
                      <div className="text-lg font-bold group-hover:text-red-400">{stage.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TELA 2: SELECIONAR CATEGORIA */}
            {selectedStage && !selectedCategory && (
              <div className="bg-neutral-800 p-8 rounded-xl border border-neutral-700">
                <button onClick={() => setSelectedStage(null)} className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"><ArrowLeft size={16}/> Voltar</button>
                <h2 className="text-2xl font-bold mb-6">{selectedStage.name} <span className="text-gray-500 text-lg font-normal">| Categorias</span></h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {VELOCROSS_CATEGORIES.map(cat => {
                    const isDone = uploadedCategories.includes(cat);
                    return (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${isDone ? 'bg-green-900/20 border-green-600 hover:bg-green-900/30' : 'bg-neutral-900 border-neutral-700 hover:border-red-500'}`}>
                        {isDone ? <Check className="text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-neutral-600" />}
                        <span className={`font-bold text-sm text-center ${isDone ? 'text-green-400' : 'text-gray-300'}`}>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TELA 3: VISUALIZAR TABELA OU UPLOAD */}
            {selectedStage && selectedCategory && (
              <div className="animate-fade-in">
                <button onClick={() => { setSelectedCategory(null); setCategoryResults([]); setIsReplacing(false); }} className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"><ArrowLeft size={16}/> Voltar para Categorias</button>

                <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden shadow-2xl">
                  
                  {/* Header da Categoria */}
                  <div className="p-6 border-b border-neutral-700 bg-neutral-900 flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-white">{selectedCategory}</h2>
                      <p className="text-red-500 text-sm">{selectedStage.name}</p>
                    </div>
                    
                    {/* Botão para alternar entre ver tabela e substituir arquivo */}
                    {!isReplacing && categoryResults.length > 0 && (
                      <button 
                        onClick={() => setIsReplacing(true)}
                        className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded transition"
                      >
                        <RefreshCw size={16} /> Substituir Planilha
                      </button>
                    )}
                    
                    {isReplacing && categoryResults.length > 0 && (
                      <button 
                        onClick={() => setIsReplacing(false)}
                        className="text-sm text-gray-400 hover:text-white underline"
                      >
                        Cancelar e ver tabela atual
                      </button>
                    )}
                  </div>

                  {/* CONTEÚDO: OU É A TABELA, OU É O UPLOAD */}
                  
                  {/* MODO 1: TABELA (Se já tem dados e não está substituindo) */}
                  {!isReplacing && categoryResults.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-900/50 text-gray-400 text-xs uppercase tracking-wider border-b border-neutral-700">
                            <th className="p-4 text-center">Pos</th>
                            <th className="p-4">Piloto</th>
                            <th className="p-4 text-center">Nº</th>
                            <th className="p-4 text-center">Voltas</th>
                            <th className="p-4">Tempo Total</th>
                            <th className="p-4">Melhor Volta</th>
                            <th className="p-4 text-right">V. Média</th>
                            <th className="p-4 text-center text-white bg-red-900/20">PTS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700 text-sm text-gray-300">
                          {categoryResults.map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-700/30">
                              <td className="p-4 text-center font-bold text-white">{row.position}º</td>
                              <td className="p-4 font-medium text-white">{row.pilot_name}</td>
                              <td className="p-4 text-center text-yellow-500 font-mono">{row.pilot_number}</td>
                              <td className="p-4 text-center">{row.laps}</td>
                              <td className="p-4 font-mono text-xs">{row.total_time}</td>
                              <td className="p-4 font-mono text-xs text-green-400">{row.best_lap}</td>
                              <td className="p-4 font-mono text-xs text-right">{row.avg_speed}</td>
                              <td className="p-4 text-center font-bold text-red-500 bg-red-900/10">{row.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* MODO 2: UPLOAD (Se não tem dados OU clicou em substituir) */}
                  {isReplacing && (
                    <div className="p-12 flex flex-col items-center justify-center bg-neutral-900/50">
                      <div className="mb-6 text-center">
                        <h3 className="text-xl text-white font-bold mb-2">
                          {categoryResults.length > 0 ? 'Substituir Resultados Existentes' : 'Lançar Resultados'}
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md">
                          Selecione o arquivo Excel/CSV. {categoryResults.length > 0 && <span className="text-red-400">Isso apagará os dados atuais desta categoria.</span>}
                        </p>
                      </div>

                      <label className={`
                        w-full max-w-lg flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all
                        ${loading ? 'border-gray-700 opacity-50' : 'border-neutral-600 hover:border-red-500 hover:bg-neutral-800'}
                      `}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {loading ? (
                            <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mb-4"/>
                          ) : (
                            <Upload size={40} className="text-gray-400 mb-4" />
                          )}
                          <p className="text-lg text-gray-300 font-medium">{loading ? 'Processando...' : 'Clique para enviar Planilha'}</p>
                        </div>
                        <input type="file" className="hidden" accept=".csv, .xlsx, .xls" disabled={loading} onChange={handleFileUpload} />
                      </label>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;