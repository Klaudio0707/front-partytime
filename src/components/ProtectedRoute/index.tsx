import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); // Pega a localização atual

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não há usuário, redireciona para o login,
  // mas guarda a página que ele tentou acessar no 'state'.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;