import axios from "axios";
export const Http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
});