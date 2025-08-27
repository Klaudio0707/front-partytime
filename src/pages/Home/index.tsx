import styles from './Home.module.css';
import api from '../../api/config'; 
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import type { IEvento } from '../../types/IEvento';
import { useAuth } from '../../context/AuthContext'; // 👈 1. Importe o useAuth

const Home = () => {
  const [parties, setParties] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 👈 2. Pegue o usuário do contexto
  const navigate = useNavigate(); // 👈 3. Pegue o hook de navegação

  useEffect(() => {
    // A lógica de busca continua a mesma, pois o endpoint agora é público
    const fetchParties = async () => {
      try {
        const response = await api.get('/parties');
        setParties(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        useToast(error.response?.data?.message || 'Erro ao carregar festas.', 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchParties();
  }, []);

  // 👇 4. Crie a função que lida com o clique
  const handlePartyClick = (partyId: string) => {
    if (user) {
      // Se o usuário estiver logado, vá para os detalhes da festa
      navigate(`/party/${partyId}`);
    } else {
      // Se não estiver logado, mostre um aviso e redirecione para o login
      useToast('Você precisa estar logado para gerenciar uma festa.', 'info');
      navigate('/login');
    }
  };

  return (
   <div className={styles.home_page}>
      <section className={styles.hero}>
        <h1>PartyTime</h1>
        <p>O seu gestor de festas pessoal. Planeie, orçamente e convide, tudo num só lugar.</p>
        {!user && (
          <Link to="/register" className="btn">Comece a Planear Gratuitamente</Link>
        )}
      </section>

      <section className={styles.parties_section}>
        <h2>Últimas Festas Criadas</h2>
        {loading ? (
          <p>A carregar eventos...</p>
        ) : (
          <ul className={styles.parties_grid}>
            {parties.map((party) => (
              <li key={party.id} className={styles.party_card} onClick={() => handlePartyClick(party.id)}>
                {/* Renderiza a imagem apenas se ela existir */}
                {party.image && (
                  <img src={party.image} alt={party.title} />
                )}
                <div className={styles.card_content}>
                  <h3>{party.title}</h3>
                  <p><strong>Autor:</strong> {party.user?.username || 'Anónimo'}</p>
                  <p><strong>Data da Festa:</strong> {party.date ? new Date(party.date).toLocaleDateString() : 'A definir'}</p>
                  <span className={styles.card_link_text}>
                    Ver Mais →
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Home;