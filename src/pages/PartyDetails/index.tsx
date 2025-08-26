import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './PartyDetails.module.css';
import AddServiceForm from '../AddService'; // Verifique se o caminho está correto
import AddGuestForm from '../../components/GuestForm';

// Interfaces para tipagem dos dados
interface IService {
  id: string;
  name: string;
  price: string; // Vem como string da API para manter a precisão
}
interface IGuest {
  id: string;
  name: string;
  rsvpToken?: string;
  phone?: string;
  status: string; // Ex: 'Pendente', 'Enviado'
}
interface IParty {
  id: string;
  title: string;
  description: string;
  date: string; // Adicionamos a data
  budget: string; // Vem como string da API
  services: IService[];
  guests: IGuest[];
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
  const handleDeleteGuest = async (guestId: string) => {
    if (window.confirm('Tem certeza que deseja remover este convidado da lista?')) {
      try {
        await apiFetch.delete(`/guests/${guestId}`);
        useToast('Convidado removido com sucesso!', 'success');
        fetchParty(); // Recarrega os dados da festa
      } catch (error: any) {
        useToast(error.response?.data?.message || 'Erro ao remover convidado.', 'error');
      }
    }
  };
  const handleWhatsAppInvite = (guest: IGuest) => {
    if (!guest.phone) {
      useToast('Este convidado não tem um número de telefone cadastrado.', 'warning');
      return;
    }
    if (!guest.rsvpToken) {
      useToast('Este convite é antigo e não possui um link de confirmação.', 'warning');
      return;
    }
    if (!party) return;

    // 👇 A LÓGICA DO LINK FOI ATUALIZADA AQUI 👇
    const rsvpUrl = `http://localhost:5173/rsvp/${guest.rsvpToken}`; // Use a URL do seu frontend
    const message = `Olá ${guest.name}! Você foi convidado para a festa "${party.title}". Por favor, confirme sua presença e veja os detalhes no link: ${rsvpUrl}`;

    const phoneNumber = `55${guest.phone.replace(/\D/g, '')}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };
  const handleGuestAdded = () => {
    fetchParty(); // Simplesmente recarrega os dados da festa
  };

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
        {/* ... (painel financeiro) ... */}
      </div>
      
      <div className={styles.services_container}>
        <h2>Serviços Contratados:</h2>
        <AddServiceForm partyId={id!} onServiceAdded={handleServiceAdded} />
        {party.services.length > 0 ? (
          <ul className={styles.item_list}>
            {party.services.map((service) => (
              <li key={service.id} className={styles.item}>
                <div className={styles.item_info}>
                  <span>{service.name}</span>
                  <small>{parseFloat(service.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</small>
                </div>
                <div className={styles.item_actions}>
                  <Link to={`/service/edit/${service.id}`} className={styles.edit_btn}>Editar</Link>
                  <button onClick={() => handleDeleteService(service.id)} className={styles.delete_btn}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>Nenhum serviço adicionado ainda.</p>}
      </div>

      <div className={styles.guests_container}>
        <h2>Convidados:</h2>
        <AddGuestForm partyId={id!} onGuestAdded={handleGuestAdded} />
        <h3>Lista de Convidados ({party.guests.length})</h3>
        {party.guests.length > 0 ? (
          <ul className={styles.item_list}>
            {party.guests.map((guest) => (
              <li key={guest.id} className={styles.item}>
                <div className={styles.item_info}>
                  <span>{guest.name}</span>
                  <small>{guest.phone}</small>
                </div>
                <div className={styles.item_actions}>
                  <span className={`${styles.status_badge} ${styles[guest.status.toLowerCase()]}`}>{guest.status}</span>
                  {guest.phone && <button onClick={() => handleWhatsAppInvite(guest)} className={styles.whatsapp_btn}>WhatsApp</button>}
                  <button onClick={() => handleDeleteGuest(guest.id)} className={styles.delete_btn}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p>Nenhum convidado adicionado ainda.</p>}
      </div>

      <div className={styles.actions_container}>
        <h2>Ações da Festa:</h2>
        <Link to={`/party/edit/${party.id}`} className="btn">Editar Festa</Link>
        {/* Usa a classe global 'btn' e a de módulo para cor específica */}
        <button onClick={handleDeleteParty} className={`btn ${styles.delete_party_btn}`}>Excluir Festa</button>
      </div>
    </div>
  );
};

export default PartyDetails;