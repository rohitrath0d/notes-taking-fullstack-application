// axios instance
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;


const ApiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

ApiInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default ApiInstance;