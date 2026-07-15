import styled from 'styled-components';

export const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background,
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',

  '@media (max-width: 768px)': {
    width: '100%',
    height: '100%',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
  },
}));

export const DesktopMain = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 2rem;
`;
