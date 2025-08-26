import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../api/config'; // Sua instância configurada do Axios
import useToast from '../../hooks/useToast'; // Seu hook de notificações
import styles from './CreateParty.module.css';

const CreateParty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const partyData = {
      title,
      description,
      budget: Number(budget),
      image,
      date: date, // ✅ CORREÇÃO APLICADA AQUI
      services: [],
    };
    console.log(partyData.date);
    try {
      const response = await apiFetch.post('/parties', partyData);
      const newPartyId = response.data.id;
      console.log(partyData.date);
      useToast('Festa criada com sucesso!', 'success');
      navigate(`/party/${newPartyId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar a festa.';
      useToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.create_party_page}>
      <h2>Crie sua Próxima Festa!</h2>
      <p>Preencha os detalhes abaixo para começar.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título da Festa:</span>
          <input type="text" placeholder="Ex: Aniversário surpresa da Maria" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span>Data da Festa:</span>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          <span>Descrição:</span>
          <textarea placeholder="Conte mais sobre a festa, tema, etc." required value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          <span>Orçamento (R$):</span>
          <input type="number" placeholder="Ex: 1500.00" required min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <label>
          <span>URL da Imagem de Capa (Opcional):</span>
          <input type="url" placeholder="https://exemplo.com/imagem.jpg" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Criando festa...' : 'Criar Festa'}
        </button>
      </form>
    </div>
  );
};

export default CreateParty;