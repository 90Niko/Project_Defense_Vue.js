import axios from 'axios';

const axiosFS = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export default axiosFS;
