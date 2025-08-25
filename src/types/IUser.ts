export interface IUser{
  id: string;      // ou number
  email: string;
  username: string;
  password: string;
  token?:string;
  // Adicione aqui qualquer outro campo que seu backend retorna sobre o usuário
}