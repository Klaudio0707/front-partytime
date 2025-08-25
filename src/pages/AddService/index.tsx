import React, { useState } from 'react';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './AddService.module.css';

interface AddServiceFormProps {
  partyId: string;
  onServiceAdded: () => void; // Função para avisar o pai que um serviço foi adicionado
}

const AddServiceForm = ({ partyId, onServiceAdded }: AddServiceFormProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      name,
      price: Number(price),
      partyId: partyId, // Anexa o ID da festa ao serviço
    };

    try {
      await apiFetch.post('/services', serviceData);
      useToast('Adicionado com sucesso!', 'success');
      setName(''); // Limpa os campos do formulário
      setPrice('');
      onServiceAdded(); // Avisa o componente pai para recarregar os dados
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao adicionar serviço.';
      useToast(msg, 'error');
    }
  };

  return (
    <form className={styles.add_service_form} onSubmit={handleSubmit}>
      <label>
        <span>Nome do Serviço:</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        <span>Preço (R$):</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="btn">Adicionar</button>
    </form>
  );
};

export default AddServiceForm;