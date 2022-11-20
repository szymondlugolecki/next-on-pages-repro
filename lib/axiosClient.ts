import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
  timeout: 10000,
  //   headers: { 'X-Custom-Header': 'foobar' },
});

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data.message || error.message;
    console.error(msg);
    return msg;
  } else {
    console.error('Non-axios error occured');
    return 'Unexpected error occured';
  }
};

export default instance;
export { handleAxiosError };
