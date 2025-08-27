import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from './validationSchema';
import { useAuth } from '../../context/AuthContext';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      password: '',
    }
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value && value.length > 0)
    );

    if (Object.keys(updateData).length === 0) {
      useToast('Nenhum dado para atualizar.', 'info');
      return;
    }

    try {
      await apiFetch.patch('/users/profile', updateData);
      useToast('Perfil atualizado com sucesso! Por favor, faça login novamente.', 'success');
      logout();
    } catch (error: any) {
      useToast(error.response?.data?.message || 'Erro ao atualizar perfil.', 'error');
    }
  };

  const onDeleteAccount = async () => {
    if (window.confirm('ATENÇÃO: Esta ação é irreversível. Tem certeza que deseja excluir sua conta e todos os seus dados?')) {
      try {
        await apiFetch.delete('/users/profile');
        useToast('Sua conta foi excluída com sucesso.', 'success');
        logout();
      } catch (error: any) {
        useToast(error.response?.data?.message || 'Erro ao excluir a conta.', 'error');
      }
    }
  };

  return (
    <div className={styles.profile_page}>
      <h2>Meu Perfil</h2>
      <p className={styles.email_display}>E-mail: {user?.email}</p>
      
      <form onSubmit={handleSubmit(onUpdateProfile)} className={styles.form}>
        <h3>Atualizar Dados</h3>
        <p>Preencha apenas os campos que deseja alterar.</p>
        <div className={styles.input_group}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input 
            id="username"
            type="text" 
            className={`${styles.input_field} ${errors.username ? styles.input_error : ''}`}
            {...register('username')} 
          />
          {errors.username && <p className={styles.error_message}>{errors.username.message}</p>}
        </div>
        <div className={styles.input_group}>
          <label htmlFor="password">Nova Senha:</label>
          <input 
            id="password"
            type="password" 
            placeholder="Mínimo de 6 caracteres" 
            className={`${styles.input_field} ${errors.password ? styles.input_error : ''}`}
            {...register('password')} 
          />
          {errors.password && <p className={styles.error_message}>{errors.password.message}</p>}
        </div>
        {/* O botão principal ainda usa a classe global 'btn' para consistência */}
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      <div className={styles.danger_zone}>
        <h3>Área de Risco</h3>
        <p>A exclusão da conta é permanente e removerá todas as suas festas.</p>
        <button onClick={onDeleteAccount} className={styles.delete_account_btn}>
          Excluir Minha Conta
        </button>
      </div>
    </div>
  );
};

export default Profile;