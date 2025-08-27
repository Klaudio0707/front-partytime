import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from './validationSchema';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ CORREÇÃO 1: A variável 'from' estava em falta.
    // Ela pega a página de onde o utilizador veio (se existir) ou define o '/dashboard' como padrão.
    const from = location.state?.from?.pathname || "/dashboard";
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    // ✅ CORREÇÃO 2: A lógica de submissão foi ajustada.
    const onSubmit = async (data: LoginFormData) => {
        try {
            // Primeiro, esperamos a função de login ser concluída.
            await login(data);
            
            // Se o login for bem-sucedido (não lançar erro), nós navegamos para a página de destino.
            navigate(from, { replace: true });
        } catch (error) {
            // O próprio método 'login' no AuthContext já lida com o toast de erro,
            // então não precisamos de fazer nada aqui, mas o try/catch é uma boa prática.
            console.error("A tentativa de login falhou:", error);
        }
    };

    return (
        <section className="form_page_container">
            <form onSubmit={handleSubmit(onSubmit)} className="form_card">
                <h1 className="form_title">Bem-vindo de volta!</h1>
                <p className="form_subtitle">Entre para gerir as suas festas.</p>
                
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
                        placeholder="Digite a sua senha" 
                        className={`input_field ${errors.password ? 'input_error' : ''}`}
                        {...register('password')} 
                    />
                    {errors.password && <p className="error_message">{errors.password.message}</p>}
                </div>
                
                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? 'A entrar...' : 'Entrar'}
                </button>
            </form>
            
            <p className={styles.register_link}>
                Não tem uma conta? <Link to="/register">Crie uma agora</Link>
            </p>
        </section>
    );
};

export default Login;