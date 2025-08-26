import React, { useState } from 'react';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './GuestForm.module.css';

interface AddGuestFormProps {
  partyId: string;
  onGuestAdded: () => void;
}

const AddGuestForm = ({ partyId, onGuestAdded }: AddGuestFormProps) => {
  const [name, setName] = useState('');

  const [phone, setPhone] = useState(''); // 👈 1. Adicione o estado para o telefone
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const guestData = {
      name,
      phone, // 👈 2. Adicione o telefone aos dados enviados
      partyId: partyId,
    };

    try {
      // A rota agora é /guests, e não /guests/invite
      await apiFetch.post('/guests', guestData);
      useToast('Convidado adicionado com sucesso!', 'success');
      setName('');
      setPhone(''); // 👈 3. Limpe o campo de telefone
      onGuestAdded();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao adicionar convidado.';
      useToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.add_guest_form} onSubmit={handleSubmit}>
      <p>Preencha os dados para adicionar uma pessoa à lista:</p>
      <label>
        <span>Nome:</span>
        <input type="text" placeholder="Nome do convidado" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
     
      {/* 👇 4. Adicione o input de telefone ao formulário 👇 */}
      <label>
        <span>Telefone (com DDD, opcional):</span>
        <input type="tel" placeholder="Ex: 81999998888" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Adicionando...' : 'Adicionar à Lista'}
      </button>
    </form>
  );
};

export default AddGuestForm;