import styled from 'styled-components';

export const Container = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background,

  '@media (max-width: 768px)': {
    width: '100%',
    height: '100%',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },

  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));
