import { useState } from "react";
import { User, Mail, Lock, Bike, ArrowRight } from "lucide-react";

const Login = () => {
  // Estado para alternar entre Login e Cadastro
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      
      {/* Container Principal */}
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">
        
        {/* --- LADO ESQUERDO: IMAGEM (Só aparece em telas médias pra cima) --- */}
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
              Gerencie suas inscrições, acompanhe resultados e garanta seu lugar no podium.
            </p>
          </div>
        </div>

        {/* --- LADO DIREITO: FORMULÁRIO --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
            
          {/* Cabeçalho do Form */}
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Bem-vindo de volta" : "Crie sua Conta"}
            </h3>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? "Entre para gerenciar suas corridas." 
                : "Preencha os dados para começar a pilotar."}
            </p>
          </div>

          {/* CAMPOS */}
          <form className="space-y-5">
            
            {/* Nome (Só no cadastro) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-600"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-600"
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Senha segura" 
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-600"
              />
            </div>

            {/* Número da Moto (Só no cadastro - Opcional e estiloso) */}
            {!isLogin && (
              <div className="relative">
                <Bike className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="number" 
                  placeholder="Número da Moto (Preferido)" 
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:border-[#D80000] focus:ring-1 focus:ring-[#D80000] transition placeholder-gray-600"
                />
              </div>
            )}

            {/* Botão de Ação */}
            <button className="w-full bg-[#D80000] hover:bg-red-700 text-white font-bold py-3 rounded shadow-[0_4px_0_rgb(150,0,0)] hover:shadow-[0_2px_0_rgb(150,0,0)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wide flex items-center justify-center gap-2 group">
              {isLogin ? "Acessar Painel" : "Cadastrar Piloto"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Trocar entre Login/Cadastro */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Ainda não tem conta?" : "Já é piloto cadastrado?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#D80000] font-bold hover:underline hover:text-red-400 transition"
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