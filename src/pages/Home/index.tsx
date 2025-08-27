import styles from './Home.module.css';
import api from '../../api/config'; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import type { IEvento } from '../../types/IEvento';
import { useAuth } from '../../context/AuthContext'; // 👈 1. Importe o useAuth

const Home = () => {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 👈 2. Pegue o usuário do contexto
  const navigate = useNavigate(); // 👈 3. Pegue o hook de navegação

  useEffect(() => {
    // A lógica de busca continua a mesma, pois o endpoint agora é público
    const fetchEventos = async () => {
      try {
        const response = await api.get('/parties');
        setEventos(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        useToast(error.response?.data?.message || 'Erro ao carregar eventos.', 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
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
    <main className={styles.container}>
      <h2 className={styles.title_home}>Bem-vindo ao PartyTime!</h2>
      <section className={styles.container_eventos}>
        <h4 className={styles.title_eventos}>Eventos em Destaques</h4>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul className={styles.eventos_grid}>
            {eventos.map((evento) => (
              // 👇 5. Transforme o 'li' em um elemento clicável
              <li 
                className={styles.evento} 
                key={evento.id} 
                onClick={() => handlePartyClick(evento.id)}
              > 
                
                <h5>{evento.title}</h5>
                <p>{evento.description}</p>
                <p>Orçamento: {evento.budget ? `R$ ${evento.budget}` : 'Não definido'}</p>
                <span>Data: {new Date(evento.date).toLocaleDateString()}</span>
                <p>{evento.author}</p>
                <img src={evento.image} alt="imagem do evento" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Home;