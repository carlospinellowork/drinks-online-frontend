import Close from '../../../../assets/icons/close';
import * as Styled from './styled';

interface Props {
  setIsOpenOrder: React.Dispatch<React.SetStateAction<boolean>>;
  finalizeOrder: () => void;
}

const Payment = ({ setIsOpenOrder, finalizeOrder }: Props) => {
  return (
    <Styled.Container>
      <div className="header">
        <h1>Finalize seu Pedido</h1>
        <button onClick={() => setIsOpenOrder(false)}>
          <Close />
        </button>
      </div>
      <div className="switchPayment">
        <h3>Escolha sua forma de pagamento</h3>
        <label>
          <input type="radio" name="paymentWithPix" value="pix" />
          PIX
        </label>
        <label>
          <input
            type="radio"
            name="paymentWithCreditCard"
            value="credit-card"
          />
          Cartão de Crédito
        </label>
        <label>
          <input type="radio" name="paymentWithDebitCard" value="debit-card" />
          Cartão de Débito
        </label>
        <label>
          <input type="radio" name="paymentWithCash" value="cash" />
          Dinheiro
        </label>
      </div>
      <button className="saveButton" type="button" onClick={finalizeOrder}>
        Finalizar o pedido
      </button>
    </Styled.Container>
  );
};

export default Payment;
