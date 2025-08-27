import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from './validationSchema';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './Register.module.css'; // Supondo que você tenha um CSS para ele

const Register = () => {
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // O DTO do backend não espera 'confirmPassword', então o omitimos.
      const { confirmPassword, ...userData } = data;
      
      await apiFetch.post('/users', userData);
      useToast('Conta criada com sucesso! Faça o login.', 'success');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar a conta.';
      useToast(errorMessage, 'error');
    }
  };

  return (
     <section className="form_page_container">
      <form onSubmit={handleSubmit(onSubmit)} className="form_card">
        <h1 className="form_title">Crie sua Conta</h1>
        <p className="form_subtitle">É rápido e fácil para começar a planear.</p>
        
        <div className="input_group">
          <label htmlFor="username">Nome de Utilizador</label>
          <input id="username" type="text" className={`input_field ${errors.username ? 'input_error' : ''}`} {...register('username')} />
          {errors.username && <p className="error_message">{errors.username.message}</p>}
        </div>
        <div className="input_group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" className={`input_field ${errors.email ? 'input_error' : ''}`} {...register('email')} />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
        </div>
        <div className="input_group">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" className={`input_field ${errors.password ? 'input_error' : ''}`} {...register('password')} />
          {errors.password && <p className="error_message">{errors.password.message}</p>}
        </div>
        <div className="input_group">
          <label htmlFor="confirmPassword">Confirme sua Senha</label>
          <input id="confirmPassword" type="password" className={`input_field ${errors.confirmPassword ? 'input_error' : ''}`} {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="error_message">{errors.confirmPassword.message}</p>}
        </div>
        
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'A criar...' : 'Finalizar Cadastro'}
        </button>
      </form>
      <p className={styles.login_link}>
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </section>
  );
};

export default Register;