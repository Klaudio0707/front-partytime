// src/components/Header/Header.tsx

import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext'; // 1. Importe o hook useAuth

const Header = () => {
  // 2. Obtenha o usuário e a função de logout do contexto
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        Party Time!
      </Link>
      <nav>
        <ul className={styles.nav_list}>
          {/* 3. Lógica de renderização condicional */}
          {user ? (
            // Se o usuário ESTIVER logado
            <>
              <li>
                <NavLink to="/">Minhas Festas</NavLink>
              </li>
              <li>
                <NavLink to="/party/new" className={styles.btn}>
                  Criar Festa
                </NavLink>
              </li>
              <li>
                {/* Opcional: Mostrar o nome do usuário */}
                <span>Olá, {user.username}!</span> 
              </li>
              <li>
                <button onClick={logout} className={styles.btn_secondary}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            // Se o usuário NÃO ESTIVER logado
            <>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register" className={styles.btn}>
                  Criar Conta
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;