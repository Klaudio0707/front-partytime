import styles from './Home.module.css'
import api from '../../api/config'; 
import { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import type { IEvento } from '../../types/IEvento';

const Home = () => {
  const [eventos, setEventos] = useState<IEvento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get('/parties');
        const err = response.data?.error
        console.log(err)
        const data = Array.isArray(response.data) ? response.data : []; // Garante que seja um array
        console.log(data)
        setEventos(data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erro ao carregar eventos, tente novamente';
        useToast(errorMessage, 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  return (
    <main className={styles.container}>
      <h2 className={styles.title_home}>PartyTime</h2>
      <section className={styles.container_eventos}>
        <h4 className={styles.title_eventos}>Eventos em Destaques</h4>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul>
            {eventos.map((evento) => (
              <li key={evento.id || evento.title}> 
                <h5>{evento.title || 'Título não disponível'}</h5>
                <p>{evento.budget || 'Orçamento não informado'}</p>
                <p>{evento.description || 'Descrição não disponível'}</p>
                <p>{evento.author || 'Autor desconhecido'}</p>
                {evento.image ? (
                  <img src={evento.image} alt={evento.description || 'Imagem da festa'} />
                ) : (
                  <p>Imagem não disponível</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Home;