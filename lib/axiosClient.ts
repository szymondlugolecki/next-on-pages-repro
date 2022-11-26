import axios from 'axios';
import { log } from 'loglevel';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/`,
  timeout: 10000,
  //   headers: { 'X-Custom-Header': 'foobar' },
});

const handleAxiosError = (error: any) => {
  log(error);
  if (axios.isAxiosError(error)) {
    const msg: string = error.response?.data?.message || error.message;
    return msg;
  } else {
    return 'Unexpected error has occured';
  }
};

export default instance;
export { handleAxiosError };
