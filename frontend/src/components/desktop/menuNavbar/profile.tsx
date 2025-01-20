import { MenuProps, Space } from 'antd';
import CartIcon from '../../../assets/icons/cart';
import UserIcon from '../../../assets/icons/user';

import * as Styled from './styled';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
];

const Profile = () => {
  return (
    <Styled.ProfileContainer>
      <button>
        <CartIcon />
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
