import { useState } from 'react';
import { useTheme } from 'styled-components';
import ChevronRight from '../../../assets/icons/chevron-right';
import Instagram from '../../../assets/icons/instagram';
import MapIn from '../../../assets/icons/map-in';
import Moon from '../../../assets/icons/Moon';
import Sun from '../../../assets/icons/Sun';
import Whatsapp from '../../../assets/icons/whatsapp';
import Logo from '../../../assets/logobar.png';
import Modal from '../parts/modal';
import * as Styled from './styled';

type HeroProps = {
  toggleTheme: () => void;
};

const Hero = ({ toggleTheme }: HeroProps) => {
  const [openInfo, setOpenInfo] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.title === 'dark';

  return (
    <>
      <Styled.Container>
        <Styled.Banner>
        </Styled.Banner>

        <Styled.ThemeButton onClick={toggleTheme}>
          {isDarkMode ? <Sun width={20} height={20} /> : <Moon width={20} height={20} />}
        </Styled.ThemeButton>

        <Styled.ContentWrapper>
          <Styled.LogoWrapper
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <img src={Logo} alt="Faustino Drinks" />
          </Styled.LogoWrapper>

          <Styled.Title>Faustino Drinks</Styled.Title>

          <Styled.Address href="#">
            <MapIn />
            Endereço do restaurante
          </Styled.Address>

          <Styled.ActionsRow>
            <Styled.ActionButton href="#">
              <Whatsapp />
            </Styled.ActionButton>
            <Styled.ActionButton href="#">
              <Instagram />
            </Styled.ActionButton>
            <Styled.ActionButton href="#">
              <MapIn />
            </Styled.ActionButton>
          </Styled.ActionsRow>

          <Styled.Description>
            Seja bem-vindo ao Faustino Drinks. Aqui, agradecemos pelo interesse em
            nos visitar. Venha nos visitar e aproveite o nosso espaço.
          </Styled.Description>

          <Styled.Divider />

          <Styled.InfoButton onClick={() => setOpenInfo(true)}>
            <div>
              <strong>Mais Informações</strong>
              <span>Conheça nossa história e detalhes</span>
            </div>
            <ChevronRight width={20} height={20} color={theme.colors.primary} />
          </Styled.InfoButton>
        </Styled.ContentWrapper>
      </Styled.Container>

      {openInfo && <Modal setOpenInfo={setOpenInfo} />}
    </>
  );
};

export default Hero;
