import { useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Para acessar o search da URL
import DrinkPlaceholder from '../../../assets/drink-placeholder.png';
import CartIcon from '../../../assets/icons/cart';
import Close from '../../../assets/icons/close';
import Trash2 from '../../../assets/icons/trash2';
import { useCart } from '../../../context/useCart';
import { useGetDrinks } from '../../../queries/drinks';
import { TDrinksData } from '../../../types/drinksData';
import { Loading } from '../../common/Loading';
import Payment from './payment';
import * as Styled from './styled';
type MenuProps = {
  category?: string;
};



const Menu = ({ category }: MenuProps) => {
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const variants = {
    open: {
      opacity: 1,
      y: '-0%',
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      y: '100%',
      transition: { duration: 0.3 },
    },
  };

  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const { data: drinks, error, isLoading } = useGetDrinks({ category, search });

  const { cart, addToCart, removeToCart, finalizeOrder } = useCart();

  const titleCategories = [
    { category: 'drinks', title: 'Drinks' },
    { category: 'whiskeys', title: 'Bebidas' },
    { category: 'beers', title: 'Cervejas' },
  ];

  if (isLoading) return <Loading />;
  if (error) return <p>Erro: {error.message}</p>;

  const filteredDrinks = drinks?.filter(({ name }: TDrinksData) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );

  const descriptionDots = (text: string) => {
    if (text.length > 30) {
      return `${text.slice(0, 30)}...`;
    }
    return text;
  };

  return (
    <Styled.Container>
      <Styled.Title>
        {category
          ? titleCategories.find((item) => item.category === category)?.title
          : 'Todos os Drinks'}
      </Styled.Title>
      <Styled.List>
        {filteredDrinks?.length ? (
          filteredDrinks.map((item: TDrinksData) => (
            <Styled.Item key={item.id}>
              <div>
                <h1>{item.name}</h1>
                <span>{descriptionDots(item.description ?? '')}</span>
                <div className="actions">
                  <p className="price">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>

                  {cart.find((cartItem) => cartItem.id === item.id) ? (
                    <div className="qty-control">
                      <button
                        className="remove"
                        onClick={() => removeToCart({ ...item, price: Number(item.price), quantity: 1 })}
                      >
                        {cart.find((cartItem) => cartItem.id === item.id)?.quantity === 1 ? <Trash2 /> : '-'}
                      </button>
                      <span className="quantity">
                        {cart.find((cartItem) => cartItem.id === item.id)?.quantity}
                      </span>
                      <button
                        className="add"
                        onClick={() => addToCart({ ...item, price: Number(item.price), photo: item.photo || DrinkPlaceholder, quantity: 1 })}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-btn"
                      onClick={() => addToCart({ ...item, price: Number(item.price), photo: item.photo || DrinkPlaceholder, quantity: 1 })}
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
              <img src={item.photo || DrinkPlaceholder} alt={item.name} />
            </Styled.Item>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </Styled.List>
      <Styled.CartToggle onClick={() => setIsOpenOrder(!isOpenOrder)}>
        <CartIcon />
      </Styled.CartToggle>
      {cart.length > 0 && isOpenOrder && (
        <Styled.Orders
          animate={isOpenOrder ? 'open' : 'closed'}
          variants={variants}
        >
          {!showPayment && (
            <>
              <div>
                <h1>Resumo do Pedido</h1>
                <button onClick={() => setIsOpenOrder(!isOpenOrder)}>
                  <Close />
                </button>
              </div>
              <div className="orderSumary">
                {cart.map((item: any) => (
                  <div className="orderItem" key={item.id}>
                    <img src={item.photo || DrinkPlaceholder} alt={item.name} />
                    <p>
                      {item.quantity}x {item.name}
                    </p>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p>
                <strong>Total:</strong> R${' '}
                {cart
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
              <button onClick={() => setShowPayment(true)}>Próximo</button>
            </>
          )}
          {showPayment && (
            <Payment
              setIsOpenOrder={setIsOpenOrder}
              finalizeOrder={finalizeOrder}
            />
          )}
        </Styled.Orders>
      )}
    </Styled.Container>
  );
};

export default Menu;
