import axios from "axios";

const apiFetch = axios.create({
  // A URL base da sua API NestJS
  baseURL: "http://localhost:3000", 

  // A linha mais importante para autenticação com cookies!
  // Isso garante que o navegador envie os cookies recebidos do backend
  // em todas as futuras requisições.
  withCredentials: true, 
});

export default apiFetch;