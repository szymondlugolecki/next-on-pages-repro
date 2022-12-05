import axios from 'axios';
import { SuccessResponse } from '../types';

const NO_RETRY_HEADER = 'x-no-retry';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const AT = localStorage.getItem('refreshToken');
//     const accessToken = AT ? JSON.parse(AT) : null;

//     if (accessToken) {
//       config.headers = {
//         ...config.headers,
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (
      !axios.isCancel(error) &&
      axios.isAxiosError(error) &&
      error?.response?.status === 403 &&
      error.config
    ) {
      try {
        if (error.config.headers && error.config.headers[NO_RETRY_HEADER]) {
          return await Promise.reject(error);
        }
        if (!error.config.headers)
          error.config.headers = {
            [NO_RETRY_HEADER]: 'true',
          };
        else error.config.headers[NO_RETRY_HEADER] = 'true';

        const { data: tokenRefreshData } = await axiosInstance.post<
          SuccessResponse<{ refreshToken: string }>
        >('auth/refresh');

        const token = tokenRefreshData.data?.refreshToken;

        if (!token) {
          return await Promise.reject(error);
        }

        error.config.headers.Authorization = token;

        localStorage.setItem('refreshToken', JSON.stringify(token));
        console.log('Setting localStorage refreshToken to', token);

        return await axiosInstance(error.config);
      } catch (e) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

const axiosErrorHandler = (error: any) => {
  let message;
  if (axios.isAxiosError(error) && error.response) {
    message = error.response.data.message;
  } else message = String(error);
  return message;
};

export { axiosInstance, axiosErrorHandler };
