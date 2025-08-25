import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      {/* O logo sempre leva para a Home pública */}
      <Link to="/" className={styles.brand}>
        Party Time!
      </Link>
      <nav>
        <ul className={styles.nav_list}>
          {user ? (
            // --- MENU DE USUÁRIO LOGADO ---
            <>
              <li>
                {/* Link para o painel de controle privado */}
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/party/new" className={styles.btn}>
                  Criar Festa
                </NavLink>
              </li>
              <li>
                <span>Olá, {user.email}!</span>
              </li>
              <li>
                <button onClick={logout} className={styles.btn_secondary}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            // --- MENU DE VISITANTE ---
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