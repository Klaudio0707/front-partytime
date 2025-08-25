import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Pegamos o usuário e o estado de carregamento do contexto

  // Enquanto a autenticação está sendo verificada, mostramos uma mensagem
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se a verificação terminou e NÃO há usuário, redireciona para o login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se há um usuário, renderiza a página solicitada (usando o <Outlet />)
  return <Outlet />;
};

export default ProtectedRoute;