import { useEffect, useState } from 'react';
import { Welcome } from '../components/Welcome/Welcome';

export default function HomePage() {
  // const [data, setData] = useState<unknown>();
  // async function getData() {
  //   const res = await fetch('/api/user/elo');
  //   const newData = await res.json();
  //   // ts-ignore
  //   setData(newData);
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <>
      <Welcome />
    </>
  );
}
