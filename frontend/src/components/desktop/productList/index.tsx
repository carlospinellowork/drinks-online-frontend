import { useParams, useSearchParams } from 'react-router-dom';
import DrinkPlaceholder from '../../../assets/drink-placeholder.png';
import Trash2Icon from '../../../assets/icons/trash2';
import { useCart } from '../../../context/useCart';
import { useGetDrinks } from '../../../queries/drinks';
import { TDrinksData } from '../../../types/drinksData';
import { Loading } from '../../common/Loading';
import * as Styled from './styled';

const ProductList = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const { data: drinks, isLoading, error } = useGetDrinks({
    category: category || 'drinks',
    search
  });

  const { cart, addToCart, removeToCart } = useCart();

  if (isLoading) return <Loading />;
  if (error) return <Styled.Container><p>Erro ao carregar produtos.</p></Styled.Container>;

  const handleAddToCart = (item: TDrinksData) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      photo: item.photo || DrinkPlaceholder,
      quantity: 1
    });
  };

  return (
    <Styled.Container>
      <Styled.Grid>
        {drinks?.map((item: TDrinksData) => {
          const cartItem = cart.find(c => c.id === item.id);
          return (
            <Styled.Card key={item.id}>
              <img src={item.photo || DrinkPlaceholder} alt={item.name} />
              <Styled.Info>
                <h1>{item.name}</h1>
                <span>{item.description ? (item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description) : ''}</span>
                <div className="price-row">
                  <p>R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Styled.AddButton onClick={() => handleAddToCart(item)}>
                      Adicionar
                    </Styled.AddButton>
                    {cartItem && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                        <Styled.QuantityBadge>
                          {cartItem.quantity}
                        </Styled.QuantityBadge>
                        <button
                          onClick={() => removeToCart(cartItem)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2Icon />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Styled.Info>
            </Styled.Card>
          );
        })}
      </Styled.Grid>
      {drinks?.length === 0 && <p>Nenhum produto encontrado.</p>}
    </Styled.Container>
  );
};

export default ProductList;
