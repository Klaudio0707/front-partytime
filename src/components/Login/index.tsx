import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from './validationSchema';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });
    const onSubmit = async (data: LoginFormData) => {
        await login(data);
    };

    return (
        <section className="form_page_container">
      <form onSubmit={handleSubmit(onSubmit)} className="form_card">
        <h1 className="form_title">Bem-vindo de volta!</h1>
        <p className="form_subtitle">Entre para gerenciar suas festas.</p>
        
        <div className="input_group">
          <label htmlFor="email">E-mail</label>
          <input 
            id="email"
            type="email" 
            placeholder="seu-email@exemplo.com" 
            className={`input_field ${errors.email ? 'input_error' : ''}`}
            {...register('email')} 
          />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="password">Senha</label>
          <input 
            id="password"
            type="password" 
            placeholder="Digite sua senha" 
            className={`input_field ${errors.password ? 'input_error' : ''}`}
            {...register('password')} 
          />
          {errors.password && <p className="error_message">{errors.password.message}</p>}
        </div>
        
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <p className={styles.register_link}>
        Não tem uma conta? <Link to="/register">Crie uma agora</Link>
      </p>
    </section>
    );
};

export default Login;