import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
   <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        Party Time!
      </Link>
      <nav>
        <ul className={styles.nav_list}>
          {user ? (
            // --- MENU DE USUÁRIO LOGADO ---
            <>
              <li>
                <NavLink to="/dashboard" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                {/* Usando classe global 'btn' */}
                <NavLink to="/party/new" className="btn">
                  Criar Festa
                </NavLink>
              </li>
              <li>
                <NavLink to={`profile/${user.id}`}>
                  <span className={styles.welcome_text}>Olá, {user.username}!</span>
                </NavLink>
              </li>
              <li>
                {/* Usando classe global 'btn-secondary' */}
                <button onClick={logout} className="btn-secondary">
                  Sair
                </button>
              </li>
            </>
          ) : (
            // --- MENU DE VISITANTE ---
            <>
              <li>
                <NavLink to="/login" className={({isActive}) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  Entrar
                </NavLink>
              </li>
              <li>
                {/* Usando classe global 'btn' */}
                <NavLink to="/register" className="btn">
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