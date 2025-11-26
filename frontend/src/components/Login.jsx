import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { User, Mail, Lock, Phone, Bike, CreditCard, ArrowRight, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Controla se é Login ou Cadastro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    identifier: '', // Para login (email, nome ou telefone)
    password: '',
    // Campos extras para cadastro
    name: '',
    email: '',
    phone: '',
    cpf: '',
    bike_number: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:3000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar solicitação");
      }

      if (isLogin) {
        // LOGIN SUCESSO
        // Salva dados do usuário para usar no Dashboard
        localStorage.setItem('user', JSON.stringify(data));
        
        // Redireciona: Se for admin, vai pro painel, senão vai pra home ou dashboard de user
        if (data.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/'); // ou '/dashboard' futuramente
        }
      } else {
        // CADASTRO SUCESSO
        setIsLogin(true); // Muda para a tela de login
        setError('');
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        setFormData({ ...formData, password: '' }); // Limpa senha
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-[#D80000] selection:text-white">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
          
          {/* Cabeçalho do Card */}
          <div className="p-8 text-center border-b border-gray-800 bg-gradient-to-b from-[#1a1a1a] to-[#111]">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
              Área do <span className="text-[#D80000]">Piloto</span>
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Acelere para dentro do sistema' : 'Crie sua conta e garanta seu gate'}
            </p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            {error && (
              <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 rounded mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* MODO LOGIN */}
              {isLogin && (
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Login</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-600" size={18} />
                    <input 
                      type="text" 
                      name="identifier" 
                      placeholder="Email, Nome ou Telefone"
                      className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none transition-colors"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* MODO CADASTRO (Campos Extras) */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-600" size={18} />
                      <input type="text" name="name" required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none" value={formData.name} onChange={handleChange} placeholder="Seu nome de piloto" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-600" size={18} />
                        <input type="text" name="phone" required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none" value={formData.phone} onChange={handleChange} placeholder="1199999..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Nº Moto</label>
                      <div className="relative">
                        <Bike className="absolute left-3 top-3 text-gray-600" size={18} />
                        <input type="text" name="bike_number" required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none" value={formData.bike_number} onChange={handleChange} placeholder="Ex: 778" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">CPF</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 text-gray-600" size={18} />
                      <input type="text" name="cpf" required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-600" size={18} />
                      <input type="email" name="email" required className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none" value={formData.email} onChange={handleChange} placeholder="seu@email.com" />
                    </div>
                  </div>
                </>
              )}

              {/* Campo Senha (Comum aos dois) */}
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-600" size={18} />
                  <input 
                    type="password" 
                    name="password" 
                    required
                    placeholder="******"
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-200 focus:border-[#D80000] focus:outline-none transition-colors"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#D80000] hover:bg-red-700 text-white font-black uppercase py-4 rounded-lg tracking-widest shadow-[0_4px_0_rgb(100,0,0)] hover:shadow-[0_2px_0_rgb(100,0,0)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')} 
                {!loading && (isLogin ? <LogIn size={20} /> : <ArrowRight size={20} />)}
              </button>

            </form>

            {/* Toggle Login/Cadastro */}
            <div className="mt-8 text-center pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-2">
                {isLogin ? 'Ainda não tem cadastro?' : 'Já tem uma conta?'}
              </p>
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-white hover:text-[#D80000] font-bold uppercase text-sm tracking-wide transition-colors"
              >
                {isLogin ? 'Criar Conta de Piloto' : 'Fazer Login'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;