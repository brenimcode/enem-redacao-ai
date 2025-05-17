
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import AuthFormInput from '@/components/AuthFormInput';
import AuthButton from '@/components/AuthButton';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Auto-focus username field on component mount
  useEffect(() => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error message
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Criar um URLSearchParams para enviar dados como x-www-form-urlencoded
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);
      
      // Fazer requisição para o backend
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      });
      
      const data = await response.json();

      console.log('Enviando dados:', formData);
      console.log('Resposta do servidor:', data);

      if (response.ok) {
        // Login bem-sucedido
        console.log('Login bem-sucedido:', data);
        
        // Armazenar o token completo no localStorage
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('tokenType', data.token_type);
        
        // Armazenar o username no localStorage
        localStorage.setItem('username', formData.username);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para o dashboard.",
          variant: "default",
          duration: 1500,
        });
        
        // Redirecionar para o dashboard
        navigate('/dashboard');
      } else {
        // Login falhou
        setError(data.detail || 'Falha no login. Verifique suas credenciais.');
        toast({
          title: "Erro de autenticação",
          description: data.detail || 'Falha no login. Verifique suas credenciais.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro de conexão. Verifique sua internet ou tente novamente mais tarde.');
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua internet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.username.trim() !== '' && formData.password !== '';

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
          <p className="text-gray-600 mt-2">Entre com suas credenciais para acessar sua conta</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <AuthFormInput
            id="username"
            name="username"
            type="text"
            label="Nome de usuário"
            placeholder="Digite seu nome de usuário"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            icon={<User size={18} />}
            autoComplete="username"
            required
          />
          
          <AuthFormInput
            id="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={<Lock size={18} />}
            autoComplete="current-password"
            required
          />
          
          <div className="pt-2">
            <AuthButton 
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </AuthButton>
          </div>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
