import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
  withCredentials: true,
});

export default instance;
