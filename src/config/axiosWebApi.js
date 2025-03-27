import axios from 'axios';

const axiosWebApi = axios.create({
  baseURL: 'http://localhost:5084',
});

export default axiosWebApi;
