import LogoBar from '../../../assets/logobar.png';
import Profile from './profile';
import SearchInput from './search-input';
import * as Styled from './styled';
type MenuNavbarProps = {
  toggleTheme: () => void;
};

export const MenuNavbar = ({ toggleTheme }: MenuNavbarProps) => {
  return (
    <Styled.Navbar>
      <Styled.Logo>
        <img src={LogoBar} alt="logo" />
      </Styled.Logo>
      <SearchInput />
      <Profile toggleTheme={toggleTheme} />
    </Styled.Navbar>
  );
};
