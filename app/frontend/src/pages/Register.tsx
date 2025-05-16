
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import AuthFormInput from '@/components/AuthFormInput';
import AuthButton from '@/components/AuthButton';
import { toast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos um número';
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos uma letra';
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Enviando dados:', formData);
      console.log('Resposta do servidor:', response);

      if (response.ok) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você já pode fazer login com suas credenciais.",
          variant: "default",
        });
        
        setFormData({
          username: '',
          full_name: '',
          email: '',
          password: ''
        });

        // Redirecionar para a página de login
        navigate('/login');
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao criar conta",
          description: errorData.detail || "Não foi possível completar o cadastro. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua internet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.username.trim() !== '' && 
    formData.full_name.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.password !== '';

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-600 mt-2">Preencha os dados abaixo para criar sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthFormInput
            id="username"
            name="username"
            type="text"
            label="Nome de usuário"
            placeholder="Escolha um nome de usuário"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            icon={<User size={18} />}
            autoComplete="username"
            required
          />
          
          <AuthFormInput
            id="full_name"
            name="full_name"
            type="text"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={formData.full_name}
            onChange={handleInputChange}
            error={errors.full_name}
            icon={<UserPlus size={18} />}
            autoComplete="name"
            required
          />
          
          <AuthFormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            icon={<Mail size={18} />}
            autoComplete="email"
            required
          />
          
          <AuthFormInput
            id="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="Crie uma senha segura"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={<Lock size={18} />}
            autoComplete="new-password"
            required
          />
          
          <div className="pt-2">
            <AuthButton 
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              {isLoading ? 'Cadastrando...' : 'Criar conta'}
            </AuthButton>
          </div>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
