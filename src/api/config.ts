import axios from "axios";


const apiFetch = axios.create({
  baseURL: "https://backend-partytime.onrender.com",
  withCredentials: true,
});



export default apiFetch;