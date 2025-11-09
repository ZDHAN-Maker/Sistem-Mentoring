import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const getCsrfCookie = async () => {
  await api.get("/sanctum/csrf-cookie");
};

export { api };
