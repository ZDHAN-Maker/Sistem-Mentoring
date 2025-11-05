import axios from 'axios';

const API_URL = 'http://127.0.0.1:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contoh request ke API
const getExampleData = () => {
  return api.get('/example') // Misalnya '/example' adalah endpoint API di Laravel
    .then(response => response.data)
    .catch(error => console.error("There was an error!", error));
};

export { getExampleData };
