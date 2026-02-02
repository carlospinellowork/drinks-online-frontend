import { useState } from 'react';
import DrinkPlaceholder from '../../../assets/drink-placeholder.png';
import CartIcon from '../../../assets/icons/cart';
import { useCart } from '../../../context/useCart';
import * as Styled from './styled';

const Cart = () => {
  const { cart, addToCart, removeToCart, finalizeOrder } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <Styled.Container>
        <Styled.EmptyCart>
          <CartIcon />
          <p>Seu carrinho está vazio.<br />Adicione alguns drinks para começar!</p>
        </Styled.EmptyCart>
      </Styled.Container>
    );
  }

  return (
    <Styled.Container>
      <Styled.Title>Seu Pedido</Styled.Title>

      {!showPayment ? (
        <>
          <Styled.ItemList>
            {cart.map((item) => (
              <Styled.CartItem key={item.id}>
                <img src={item.photo || DrinkPlaceholder} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => removeToCart(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </Styled.CartItem>
            ))}
          </Styled.ItemList>

          <Styled.Footer>
            <div className="total-row">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
            </div>
            <Styled.CheckoutButton onClick={() => setShowPayment(true)}>
              Continuar para Pagamento
            </Styled.CheckoutButton>
          </Styled.Footer>
        </>
      ) : (
        <>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Como deseja pagar?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', fontSize: '1.1rem', alignItems: 'center' }}>
                <input type="radio" name="payment" defaultChecked style={{ width: '18px', height: '18px' }} /> PIX
              </label>
              <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', fontSize: '1.1rem', alignItems: 'center' }}>
                <input type="radio" name="payment" style={{ width: '18px', height: '18px' }} /> Cartão de Crédito
              </label>
              <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', fontSize: '1.1rem', alignItems: 'center' }}>
                <input type="radio" name="payment" style={{ width: '18px', height: '18px' }} /> Cartão de Débito
              </label>
              <label style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer', fontSize: '1.1rem', alignItems: 'center' }}>
                <input type="radio" name="payment" style={{ width: '18px', height: '18px' }} /> Dinheiro
              </label>
            </div>
          </div>
          <Styled.Footer>
            <div className="total-row">
              <span>Total:</span>
              <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Styled.CheckoutButton
                style={{ background: '#eee', color: '#666', boxShadow: 'none' }}
                onClick={() => setShowPayment(false)}
              >
                Voltar
              </Styled.CheckoutButton>
              <Styled.CheckoutButton onClick={() => {
                finalizeOrder();
                setShowPayment(false);
              }}>
                Finalizar
              </Styled.CheckoutButton>
            </div>
          </Styled.Footer>
        </>
      )}
    </Styled.Container>
  );
};

export default Cart;
