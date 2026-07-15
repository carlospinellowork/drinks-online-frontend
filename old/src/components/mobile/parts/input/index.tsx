import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import Search from '../../../../assets/icons/search';
import * as Styled from './styled';

const Input = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchString = event.target.value;

      if (searchString) {
        searchParams.set('search', searchString);
      } else {
        searchParams.delete('search');
      }

      setSearchParams(searchParams);
    },
    500,
  );

  return (
    <Styled.Container>
      <Styled.Input
        type="text"
        placeholder="Buscar produto"
        onChange={handleChange}
        ref={searchInput}
        defaultValue={searchParams.get('search') || ''}
      />
      <Search />
    </Styled.Container>
  );
};

export default Input;
