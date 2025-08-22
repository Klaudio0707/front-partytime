import React, { useState } from 'react';
import apiFetch from '../../api/config'; // Nosso Axios configurado
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import useToast from '../../hooks/useToast';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // O useNavigate nos permitirá redirecionar o usuário após o registro
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiFetch.post('/users', {
        username,
        email,
        password,
      });

      // Verifique se a requisição foi bem-sucedida (ex: status 201 Created)
      if (response.status === 201) {
        useToast('Conta criada com sucesso!', 'success', {
          icon: <FaCheckCircle size={24} />,
        });

        // Adicione um pequeno atraso antes de navegar
        setTimeout(() => {
          navigate('/login');
        }, 1500); // Atraso de 1.5 segundos para dar tempo de ler o toast
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro, tente novamente';
      useToast(errorMessage, 'warning', { // Lembre-se da vírgula aqui
        icon: <FaExclamationTriangle size={24} />,
      });
      setIsLoading(false); // Pare o loading em caso de erro
    } 
    // Não coloque o setIsLoading(false) aqui no 'finally' 
    // para que o botão continue desabilitado até o redirecionamento
  };

  return (
   <div className={styles.register_page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Criar Conta</h2>

        <div className={styles.input_group}>
          <label htmlFor="username">Nome de usuário</label>
          <input
            id="username"
            type="text"
            placeholder="Como podemos te chamar?"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.input_group}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Crie uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;