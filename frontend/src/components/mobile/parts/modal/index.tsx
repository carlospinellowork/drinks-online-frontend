import Close from '../../../../assets/icons/close';
import * as Styled from './styled';

interface ModalProps {
  setOpenInfo: (openInfo: boolean) => void;
}
const Modal = ({ setOpenInfo }: ModalProps) => {
  return (
    <Styled.Container>
      <Styled.Box>
        <Styled.Header>
          <h1>Mais informações</h1>
          <button onClick={() => setOpenInfo(false)}>
            <Close />
          </button>
        </Styled.Header>
        <Styled.Content>
          <div>
            <h3>Contatos</h3>
            <p>faustinodrinks@outlook.com</p>
          </div>
          <div>
            <h3>Horário</h3>
            <p>Terça, Quarta e Quinta: 18:00 a 23:00</p>
            <p>Sexta, Sabado e Domingo: 18:00 a 01:00</p>
          </div>
        </Styled.Content>
      </Styled.Box>
    </Styled.Container>
  );
};

export default Modal;
