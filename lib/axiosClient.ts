import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
  timeout: 1000,
  //   headers: { 'X-Custom-Header': 'foobar' },
});

export default instance;
