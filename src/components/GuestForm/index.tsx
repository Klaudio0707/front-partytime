import React, { useState } from 'react';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './GuestForm.module.css'; // Criaremos este CSS a seguir

interface AddGuestFormProps {
  partyId: string;
  onGuestAdded: () => void;
}

const AddGuestForm = ({ partyId, onGuestAdded }: AddGuestFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const guestData = {
      name,
      email,
      partyId: partyId,
    };

    try {
      await apiFetch.post('/guests/invite', guestData);
      useToast('Convite enviado com sucesso!', 'success');
      setName('');
      setEmail('');
      onGuestAdded(); // Avisa o componente pai para recarregar os dados
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao enviar convite.';
      useToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.add_guest_form} onSubmit={handleSubmit}>
      <p>Preencha os dados para convidar uma pessoa:</p>
      <label>
        <span>Nome:</span>
        <input type="text" placeholder="Nome do convidado" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        <span>E-mail:</span>
        <input type="email" placeholder="E-mail do convidado" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Convidar'}
      </button>
    </form>
  );
};

export default AddGuestForm;