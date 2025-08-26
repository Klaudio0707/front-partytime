import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './RsvpPage.module.css'; // Criaremos este CSS a seguir

const RsvpPage = () => {
  const { token } = useParams<{ token: string }>(); // Pega o token da URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Para mostrar a mensagem final
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Envia o token (na URL) e a senha (no corpo) para o backend
      const response = await apiFetch.post(`/rsvp/${token}`, { password });
      
      // Se deu certo, exibe a mensagem de sucesso e esconde o formulário
      setMessage(response.data.message || 'Obrigado por confirmar!');
      useToast('Presença confirmada com sucesso!', 'success');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Ocorreu um erro ao confirmar. Verifique a senha ou o link do convite.';
      useToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se já houver uma mensagem final, mostra só ela
  if (message) {
    return (
      <div className={styles.rsvp_page}>
        <h1>{message}</h1>
      </div>
    );
  }

  // Se não, mostra o formulário
  return (
    <div className={styles.rsvp_page}>
      <h2>Confirme sua Presença</h2>
      <p>Você foi convidado para uma festa! Por favor, insira a senha do evento para confirmar sua presença.</p>
      
      <form onSubmit={handleSubmit}>
        <label>
          <span>Senha da Festa:</span>
          <input
            type="password"
            placeholder="Digite a senha aqui"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Confirmando...' : 'Confirmar Presença'}
        </button>
      </form>
    </div>
  );
};

export default RsvpPage;