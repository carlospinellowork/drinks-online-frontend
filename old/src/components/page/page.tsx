import { useParams } from 'react-router-dom';
import { useScreenWidth } from '../../hooks/useScreenWidth';
import Cart from '../desktop/cart';
import Categories from '../desktop/categories';
import { MenuNavbar } from '../desktop/menuNavbar';
import ProductList from '../desktop/productList';
import Header from '../mobile/header';
import Hero from '../mobile/hero';
import Menu from '../mobile/menu';
import * as Styled from './styled';

type PageProps = {
  toggleTheme: () => void;
};

const Page = ({ toggleTheme }: PageProps) => {
  const { category } = useParams<{ category: string }>();
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth > 1024;

  return (
    <>
      {isDesktop && (
        <Styled.Container>
          <MenuNavbar toggleTheme={toggleTheme} />
          <Categories />
          <Styled.DesktopMain>
            <Styled.ContentArea>
              <ProductList />
            </Styled.ContentArea>
            <Cart />
          </Styled.DesktopMain>
        </Styled.Container>
      )}
      {!isDesktop && (
        <Styled.Container>
          <Hero toggleTheme={toggleTheme} />
          <Header />
          <Menu category={category ?? 'drinks'} />
        </Styled.Container>
      )}
    </>
  );
};

export default Page;
