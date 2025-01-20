import { Input, type GetProps } from 'antd';

import * as Styled from './styled';

type SearchProps = GetProps<typeof Input.Search>;

const SearchInput = () => {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <Styled.SearchInput placeholder="input search text" onSearch={onSearch} />
  );
};

export default SearchInput;
