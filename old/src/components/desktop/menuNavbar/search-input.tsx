import { useSearchParams } from 'react-router-dom';
import * as Styled from './styled';

const SearchInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSearch = (value: string) => {
    if (value) {
      searchParams.set('search', value);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <Styled.SearchInput
      placeholder="Pesquise seu drink favorito..."
      onSearch={onSearch}
      defaultValue={searchParams.get('search') || ''}
      allowClear
    />
  );
};

export default SearchInput;
