import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Bike, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Estados para guardar o que o usuário digita
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bike_number: ""
  });

  // Função para atualizar os dados enquanto digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função de Enviar (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // --- SUCESSO NO LOGIN ---
          // Salva os dados do usuário no navegador
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // AQUI ESTÁ A MUDANÇA: Verifica se é ADMIN
          if (data.user.isAdmin) {
             // Se for o email do Tamura, vai pro painel do chefe
             navigate("/admin"); 
          } else {
             // Se for piloto comum, vai pro painel normal
             navigate("/painel"); 
          }

        } else {
          // --- SUCESSO NO CADASTRO ---
          alert("Cadastro realizado! Agora faça login.");
          setIsLogin(true); // Troca para a tela de login
        }
      } else {
        alert("Erro: " + data.error);
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
        
        {/* Lado Esquerdo (Imagem) */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1568284566453-9bb50b3cb863?q=80&w=800&auto=format&fit=crop" 
            alt="Motocross Action" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]"></div>
          <div className="absolute bottom-10 left-10 z-10">
            <h2 className="text-4xl font-black italic text-white uppercase leading-none mb-2">
              Junte-se à <span className="text-[#D80000]">Elite</span>
            </h2>
            <p className="text-gray-300 text-sm max-w-xs">
              Gerencie suas inscrições e garanta seu lugar no podium.
            </p>
          </div>
        </div>

        {/* Lado Direito (Formulário) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Bem-vindo de volta" : "Crie sua Conta"}
            </h3>
            <p className="text-gray-400 text-sm">
              {isLogin ? "Entre para gerenciar suas corridas." : "Preencha os dados para começar a pilotar."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nome Completo" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] transition"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                name="email"
                placeholder="Seu melhor e-mail" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                name="password"
                placeholder="Senha segura" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] transition"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Bike className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="number" 
                  name="bike_number"
                  placeholder="Número da Moto (Opcional)" 
                  value={formData.bike_number}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] transition"
                />
              </div>
            )}

            <button type="submit" className="w-full bg-[#D80000] hover:bg-red-700 text-white font-bold py-3 rounded shadow-lg uppercase tracking-wide flex items-center justify-center gap-2 group transition transform hover:-translate-y-1">
              {isLogin ? "Acessar Painel" : "Cadastrar Piloto"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Ainda não tem conta?" : "Já é piloto cadastrado?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#D80000] font-bold hover:underline"
              >
                {isLogin ? "Cadastre-se agora" : "Fazer Login"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;