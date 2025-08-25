
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import apiFetch from "../api/config";
import type{ IUser } from "../types/IUser";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

// A interface e a criação do contexto continuam as mesmas
interface AuthContextType {
    user: IUser| null;
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
        const checkUserStatus = async () => {
          try {
              const response = await apiFetch.get("/auth/profile");
              setUser(response.data);
          } catch (error) {
              setUser(null); 
          } finally {
              setLoading(false);
          }
      };
      checkUserStatus();
    }, []);


    const login = async (loginData: any) => {
        // A lógica de login não muda, pois a rota POST /auth/login está correta
        await apiFetch.post("/auth/login", loginData);
        
        // Após o login, buscamos os dados do usuário para atualizar o estado
        const userResponse = await apiFetch.get("/auth/profile");
        setUser(userResponse.data);
        
        useToast("Login bem-sucedido!");
        navigate("/home");
    };

    const logout = async () => {
        try {
            // MUDANÇA 2: Chamamos a sua rota POST /auth/logout
            await apiFetch.post("/auth/logout"); 
        } finally {

            setUser(null);
            navigate("/login");
            useToast("Você saiu da sua conta.");
        }
    };
    
    return (
          <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children} 
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