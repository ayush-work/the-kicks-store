import Arrivals from '@components/Arrivals';
import Category from '@components/Category';
import Products from '@components/Products';
import Hero from '@components/Hero';
import styles from '../styles/Home.module.scss';
import FooterTop from '@components/FooterTop';
import { useEffect } from 'react';
export default function Home({ newArrivals, sneakers }) {
  useEffect(() => {
    if (!localStorage.getItem('cartList'))
      localStorage.setItem('cartList', JSON.stringify([]));
  }, []);
  return (
    <div className={styles.body}>
      <Hero></Hero>
      <Arrivals newArrivals={newArrivals}></Arrivals>
      <Category></Category>
      <Products sneakers={sneakers}></Products>
      <FooterTop></FooterTop>
    </div>
  );
}
export const getServerSideProps = async () => {
  const fetchShoes = await fetch('http://localhost:3000/api/shoes', {
    method: 'GET',
  });
  const fetchShoesData = await fetchShoes.json();

  const apiRes = await fetch(
    'https://api.jsonbin.io/v3/b/6123d9502aa80036126e94d0',
    {
      method: 'GET',
      headers: {
        'X-Master-Key':
          '$2b$10$y/Nb3KFy/5rQNMhbvh4FGuX144Sqn9RkLEHAJckYwq0pG8krn69Ni',
      },
    }
  );
  const apiResult = await apiRes.json();

  const newArrivals = apiResult.record
    ?.filter((sneak) => sneak.image.original && sneak.retailPrice)
    .slice(0, 8);
  const sneakers = apiResult.record?.filter(
    (sneak) => sneak.image.small && sneak.retailPrice
  );

  return {
    props: {
      newArrivals,
      sneakers: fetchShoesData.data,
    },

    // revalidate: 20,
  };
};
