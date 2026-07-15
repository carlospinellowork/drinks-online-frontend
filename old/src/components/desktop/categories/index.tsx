import { useNavigate, useParams } from 'react-router-dom';
import * as Styled from './styled';

const titleCategories = [
  { category: 'drinks', title: 'Drinks' },
  { category: 'whiskeys', title: 'Bebidas' },
  { category: 'beers', title: 'Cervejas' },
];

const Categories = () => {
  const { category: currentCategory } = useParams<{ category: string }>();
  const navigate = useNavigate();

  return (
    <Styled.Container>
      <Styled.CategoryItem
        active={!currentCategory || currentCategory === 'drinks'}
        onClick={() => navigate('/drinks')}
      >
        Drinks
      </Styled.CategoryItem>
      {titleCategories.filter(c => c.category !== 'drinks').map((item) => (
        <Styled.CategoryItem
          key={item.category}
          active={currentCategory === item.category}
          onClick={() => navigate(`/${item.category}`)}
        >
          {item.title}
        </Styled.CategoryItem>
      ))}
    </Styled.Container>
  );
};

export default Categories;
