import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './Dashboard.module.css';

interface IParty {
  id: string;
  title: string;
  date: string | null; // A data pode ser nula
  budget: string | null;
  image:string | null;
  services: unknown[];
}

const Dashboard = () => {
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch.get('/parties/my-parties')
      .then(response => setParties(response.data))
      .catch(() => useToast('Erro ao carregar suas festas.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const summaryData = useMemo(() => {
    const totalBudget = parties.reduce((sum, party) => {
      return sum + parseFloat(party.budget || '0');
    }, 0);
    return {
      partyCount: parties.length,
      totalBudget,
    };
  }, [parties]);

  if (loading) {
    return <div className={styles.loading_container}>Carregando seu painel...</div>;
  }

  if (parties.length === 0) {
    return (
      <div className={styles.empty_dashboard}>
        <h2>Você ainda não tem festas!</h2>
        <p>Que tal começar a planear seu próximo evento agora mesmo?</p>
        <Link to="/party/new" className="btn">
          Criar minha primeira festa
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Meu Painel</h1>
        <Link to="/party/new" className="btn">
          + Criar Nova Festa
        </Link>
      </div>

      <section className={styles.summary}>
        <div className={styles.summary_card}>
          <h3>{summaryData.partyCount}</h3>
          <p>Festas Planeadas</p>
        </div>
        <div className={styles.summary_card}>
          <h3>
            {summaryData.totalBudget.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
          <p>Orçamento Total</p>
        </div>
      </section>

      <section className={styles.parties_list}>
  <h2>Minhas Festas</h2>
  <div className={styles.parties_grid}>
    {parties.map((party) => (
      <Link to={`/party/${party.id}`} key={party.id} className={styles.party_card_link}>
        <div className={styles.party_card}>
       
          {party.image && (
            <img src={party.image} alt={party.title} />
          )}
          
          {/* 👇 2. ENVOLVE TODO O CONTEÚDO DE TEXTO NUMA NOVA DIV 👇 */}
          <div className={styles.card_content}>
            <h3>{party.title}</h3>
            <p className={styles.party_info}>
              <strong>Data: </strong>
              {party.date 
                ? `${new Date(party.date).toLocaleDateString('pt-BR')} às ${new Date(party.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                : 'Data não definida'
              }
            </p>
            <p className={styles.party_info}>
              <strong>Orçamento:</strong> {parseFloat(party.budget || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className={styles.party_info}>
              <strong>Serviços:</strong> {party.services.length}
            </p>
            <span className={styles.card_link_text}>
              Gerir Festa →
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>
    </div>
  );
};

export default Dashboard;