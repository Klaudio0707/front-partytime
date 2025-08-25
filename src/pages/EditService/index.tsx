import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './CreateParty.module.css'; // Reutilizando o CSS

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [partyId, setPartyId] = useState(''); // Precisamos do partyId para redirecionar de volta

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await apiFetch.get(`/services/${id}`);
        const service = response.data;
        setName(service.name);
        setPrice(service.price);
        setPartyId(service.partyId); // Guarda o ID da festa
      } catch (error) {
        useToast('Erro ao carregar dados do serviço.', 'error');
      }
    };
    fetchServiceData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = { name, price: Number(price) };

    try {
      await apiFetch.patch(`/services/${id}`, serviceData);
      useToast('Serviço atualizado com sucesso!', 'success');
      navigate(`/party/${partyId}`); // Volta para a página de detalhes da festa
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao atualizar o serviço.';
      useToast(msg, 'error');
    }
  };

  return (
    <div className={styles.create_party_page}>
      <h2>Editando o Serviço: {name}</h2>
      <p>Altere os dados do serviço abaixo.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome do Serviço:</span>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          <span>Preço (R$):</span>
          <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <button type="submit" className="btn">Salvar Alterações</button>
        {partyId && (
          <Link to={`/party/${partyId}`} className="btn btn-secondary">
            Cancelar
          </Link>
        )}
      </form>
    </div>
  );
};

export default EditService;