import { Coin } from 'tabler-icons-react';

export default function Ducat({ size, addMargin }: { size?: number; addMargin?: boolean }) {
  const ducatProps: any = { color: '#ffd43b' };
  if (addMargin) {
    ducatProps.style = { marginRight: '3px', marginLeft: '3px' };
  }
  if (size) ducatProps.size = size;
  return <Coin {...ducatProps} />;
}
