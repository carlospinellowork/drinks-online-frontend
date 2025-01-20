import { useParams } from 'react-router-dom';
import { useScreenWidth } from '../../hooks/useScreenWidth';
import { MenuNavbar } from '../desktop/menuNavbar';
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
          <MenuNavbar />
          <h1>Novo Cardapio em breve (versão desktop)</h1>
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
