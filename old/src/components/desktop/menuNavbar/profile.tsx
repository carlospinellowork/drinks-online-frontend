import { MenuProps, Space } from 'antd';
import { useTheme } from 'styled-components';
import Moon from '../../../assets/icons/Moon';
import Sun from '../../../assets/icons/Sun';
import UserIcon from '../../../assets/icons/user';

import * as Styled from './styled';

interface ProfileProps {
  toggleTheme: () => void;
}

const Profile = ({ toggleTheme }: ProfileProps) => {
  const theme = useTheme();
  const isDarkMode = theme.title === 'dark';

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Minha Conta',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: isDarkMode ? 'Modo Claro' : 'Modo Escuro',
      onClick: toggleTheme,
    },
  ];

  return (
    <Styled.ProfileContainer>
      <button onClick={toggleTheme} title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}>
        {isDarkMode ? <Sun width={24} height={24} /> : <Moon width={24} height={24} />}
      </button>
      <Styled.MenuDropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <UserIcon />
          </Space>
        </a>
      </Styled.MenuDropdown>
    </Styled.ProfileContainer>
  );
};

export default Profile;
