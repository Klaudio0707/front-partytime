import React, { useState } from 'react';
import apiFetch from '../../api/config';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import useToast from '../../hooks/useToast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiFetch.post('/auth/login', {
                email,
                password,
            });
            useToast('Login realizado com sucesso!');
            navigate('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Erro, tente novamente';
            useToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    function handleRegister(): void {
        navigate('/register');
    }

    return (
        <div className={styles.login_page}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Entrar</h2>

                <div className={styles.input_group}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="seuemail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.input_group}>
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className={styles.button} type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                <button 
                  type="button" 
                  className={styles.buttonRegister} 
                  onClick={handleRegister} 
                  disabled={isLoading}
                >
                    Registrar
                </button>
            </form>
        </div>
    );
};

export default Login;