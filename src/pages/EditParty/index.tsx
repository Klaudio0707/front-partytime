import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './CreateParty.module.css';

const EditParty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState('');
  
  // Busca os dados da festa para preencher o formulário
  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await apiFetch.get(`/parties/${id}`);
        const party = response.data;
        setTitle(party.title);
        setDescription(party.description);
        setBudget(party.budget);
        setImage(party.image || '');
        // Formata a data para o formato YYYY-MM-DD que o input type="date" espera
        setDate(new Date(party.date).toISOString().split('T')[0]);
      } catch (error) {
        useToast('Erro ao carregar dados da festa.', 'error');
      }
    };
    fetchPartyData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const partyData = {
      title,
      description,
      budget: Number(budget),
      date,
      image,
    };

    try {
      await apiFetch.patch(`/parties/${id}`, partyData);
      useToast('Festa atualizada com sucesso!', 'success');
      navigate(`/party/${id}`); // Volta para a página de detalhes
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao atualizar a festa.';
      useToast(msg, 'error');
    }
  };

  return (
    <div className={styles.create_party_page}>
      <h2>Editando sua Festa: {title}</h2>
      <p>Altere os campos que desejar.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título da Festa:</span>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span>Descrição:</span>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          <span>Orçamento (R$):</span>
          <input type="number" required value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <label>
          <span>Data:</span>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          <span>Imagem:</span>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <button type="submit" className="btn">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditParty;