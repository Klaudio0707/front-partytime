import axios from "axios";

const apiFetch = axios.create({
  // A URL base da sua API NestJS
  baseURL: "http://localhost:3000", 

  withCredentials: true, 
});

export default apiFetch;