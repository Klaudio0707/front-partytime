import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './Dashboard.module.css';

interface IParty {
  id: string;
  title: string;
  date: string;
  budget: string | null;
  services: unknown[];
}

const Dashboard = () => {
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserParties = async () => {
      try {
        const response = await apiFetch.get('/parties/my-parties');
        setParties(response.data);
      } catch (error) {
        useToast('Erro ao carregar suas festas.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUserParties();
  }, []);

  const summaryData = useMemo(() => {
    const totalBudget = parties.reduce((sum, party) => {
      const budgetValue = parseFloat(party.budget || '0');
      return sum + budgetValue;
    }, 0);
    return {
      partyCount: parties.length,
      totalBudget: totalBudget,
    };
  }, [parties]);

  // 1. PRIMEIRO, CUIDAMOS DO ESTADO DE CARREGAMENTO
  if (loading) {
    return <div className={styles.loading_container}>Carregando seu painel...</div>;
  }

  // 2. DEPOIS, CUIDAMOS DO ESTADO VAZIO (SE NÃO ESTIVER CARREGANDO E NÃO HOUVER FESTAS)
  if (parties.length === 0) {
    return (
      <div className={styles.empty_dashboard}>
        <h2>Você ainda não tem festas!</h2>
        <p>Que tal começar a planejar seu próximo evento agora mesmo?</p>
        <Link to="/party/new" className="btn">
          Criar minha primeira festa
        </Link>
      </div>
    );
  }

  // 3. SE PASSOU PELAS VERIFICAÇÕES, MOSTRAMOS O DASHBOARD COMPLETO
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
          <p>Festas Planejadas</p>
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
                <h3>{party.title}</h3>
                <p className={styles.party_info}>
                  <strong>Data:</strong> {new Date(party.date).toLocaleDateString('pt-BR')}
                </p>
                <p className={styles.party_info}>
                  <strong>Orçamento:</strong> {parseFloat(party.budget || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className={styles.party_info}>
                  <strong>Serviços:</strong> {party.services.length}
                </p>
                <span className={styles.card_link_text}>
                  Gerenciar Festa →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;