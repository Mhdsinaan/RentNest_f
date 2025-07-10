import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7044/",
  withCredentials: true,
});
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;