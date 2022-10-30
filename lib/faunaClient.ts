import faunadb from 'faunadb';

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET || '',
  // @ts-ignore
  fetch: (url, params) => {
    const signal = params?.signal;
    delete params?.signal;
    const abortPromise = new Promise((resolve) => {
      if (signal) {
        signal.onabort = resolve;
      }
    });
    return Promise.race([abortPromise, fetch(url, params)]);
  },
});

const q = faunadb.query;

export default client;
export { q };
