import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './PartyDetails.module.css';
import AddServiceForm from '../AddService'; // Verifique se o caminho está correto

// Interfaces para tipagem dos dados
interface IService {
  id: string;
  name: string;
  price: string; // Vem como string da API para manter a precisão
}

interface IParty {
  id: string;
  title: string;
  description: string;
  date: string; // Adicionamos a data
  budget: string; // Vem como string da API
  services: IService[];
}

const PartyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [party, setParty] = useState<IParty | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar/recarregar os dados da festa
  const fetchParty = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFetch.get(`/parties/${id}`);
      setParty(response.data);
    } catch (error) {
      useToast('Erro ao carregar os detalhes da festa.', 'error');
      navigate('/dashboard'); // Se der erro (ex: festa não existe), volta pro dashboard
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Busca os dados iniciais quando o componente é montado
  useEffect(() => {
    fetchParty();
  }, [fetchParty]);

  // Calcula o resumo financeiro, memorizado para melhor performance
  const financialSummary = useMemo(() => {
    if (!party) {
      return { spentBudget: 0, remainingBudget: 0 };
    }
    const spentBudget = party.services.reduce((sum, service) => {
      return sum + parseFloat(service.price || '0');
    }, 0);
    const remainingBudget = parseFloat(party.budget || '0') - spentBudget;
    return { spentBudget, remainingBudget };
  }, [party]);

  // --- Handlers de Ações ---
  const handleServiceAdded = () => {
    fetchParty(); // Recarrega os dados após adicionar um serviço
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await apiFetch.delete(`/services/${serviceId}`);
        useToast('Serviço excluído com sucesso!', 'success');
        fetchParty(); // Recarrega os dados para atualizar a lista
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Erro ao excluir serviço.';
        useToast(msg, 'error');
      }
    }
  };

  const handleDeleteParty = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta festa? Esta ação não pode ser desfeita.')) {
      try {
        await apiFetch.delete(`/parties/${id}`);
        useToast('Festa excluída com sucesso!', 'success');
        navigate('/dashboard'); // Redireciona após excluir a festa
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Erro ao excluir a festa.';
        useToast(msg, 'error');
      }
    }
  };

  // --- Renderização ---
  if (loading) {
    return <p className={styles.loading_text}>Carregando festa...</p>;
  }

  if (!party) {
    return <p className={styles.loading_text}>Festa não encontrada!</p>;
  }

  return (
    <div className={styles.party_details}>
      <Link to="/dashboard" className={styles.back_link}>&larr; Voltar para o Dashboard</Link>
      
      <header className={styles.party_header}>
        <h1>{party.title}</h1>
        <p className={styles.party_date}>Data: {new Date(party.date).toLocaleDateString()}</p>
        <p className={styles.party_description}>{party.description}</p>
      </header>
      
      <div className={styles.financial_summary}>
        <div className={styles.summary_card}>
          <h3>Orçamento Total</h3>
          <p>{parseFloat(party.budget || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className={styles.summary_card}>
          <h3>Total Gasto</h3>
          <p>{financialSummary.spentBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className={`${styles.summary_card} ${financialSummary.remainingBudget < 0 ? styles.negative_balance : ''}`}>
          <h3>Saldo Restante</h3>
          <p>{financialSummary.remainingBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>
      
      <div className={styles.services_container}>
        <h2>Serviços Contratados:</h2>
        {party.services.length > 0 ? (
          <ul className={styles.service_list}>
            {party.services.map((service) => (
              <li key={service.id} className={styles.service_item}>
                <div className={styles.service_info}>
                  <span>{service.name}</span>
                  <span>{parseFloat(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <Link to={`/service/edit/${service.id}`} className={styles.edit_btn}>Editar</Link>
                <button onClick={() => handleDeleteService(service.id)} className={styles.delete_btn}>Excluir</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum serviço contratado ainda.</p>
        )}
      </div>

      <div className={styles.add_service_container}>
        <h2>Adicionar um Novo Serviço:</h2>
        <AddServiceForm partyId={id!} onServiceAdded={handleServiceAdded} />
      </div>

      <div className={styles.actions_container}>
        <h2>Ações da Festa:</h2>
        <Link to={`/party/edit/${id}`} className="btn">Editar Festa</Link>
        
        <button onClick={handleDeleteParty} className={styles.delete_party_btn}>Excluir Festa</button>
      </div>
    </div>
  );
};

export default PartyDetails;