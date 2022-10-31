import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
  timeout: 1000,
  //   headers: { 'X-Custom-Header': 'foobar' },
});

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error(error.message);
  } else {
    console.error('Non-axios error occured');
  }
};

export default instance;
export { handleAxiosError };
