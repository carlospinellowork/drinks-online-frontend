import LogoBar from '../../../assets/logobar.png';
import Profile from './profile';
import SearchInput from './search-input';
import * as Styled from './styled';
export const MenuNavbar = () => {
  return (
    <Styled.Navbar>
      <Styled.Logo>
        <img src={LogoBar} alt="logo" />
      </Styled.Logo>
      <SearchInput />
      <Profile />
    </Styled.Navbar>
  );
};
