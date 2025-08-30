import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import apiFetch from "../api/config";
import type{ IUser } from "../types/IUser";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    login: (loginData: any) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        //  Cria um controlador para a nossa requisição
        const controller = new AbortController();
        const signal = controller.signal;
      
        const checkUserStatus = async () => {
          try {
            // Passa o 'sinal' para o Axios. Se o sinal for 'abortado', a requisição é cancelada.
            const response = await apiFetch.get("/auth/profile", { signal });
            setUser(response.data);
          } catch (error: any) {
            // Se o erro for de cancelamento, nós o ignoramos.
            if (error.name !== 'CanceledError') {
              setUser(null);
            }
          } finally {
            // Garantimos que o loading termine apenas se a requisição não for cancelada
            if (!signal.aborted) {
              setLoading(false);
            }
          }
        };
        checkUserStatus();
      
        //  A FUNÇÃO DE LIMPEZA: Será executada se o componente for desmontado
        return () => {
          controller.abort(); // Cancela a requisição pendente
        };
      }, []); // O array vazio está correto aqui

    const login = async (loginData: any) => {
        try {
            await apiFetch.post("/auth/login", loginData);
            
            const userResponse = await apiFetch.get("/auth/profile");
            setUser(userResponse.data);
            
            useToast("Login bem-sucedido!", "success");
            navigate("/dashboard"); 
        } catch (error: any) {
            const msg = error.response?.data?.message || "Email ou senha inválidos.";
            useToast(msg, "error");
        }
    };

    const logout = async () => {
        try {
            await apiFetch.post("/auth/logout"); 
        } finally {
            setUser(null);
            navigate("/login");
            useToast("Você saiu da sua conta.");
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};