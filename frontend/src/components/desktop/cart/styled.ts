import styled from 'styled-components';

export const Container = styled.aside`
  width: 400px;
  background: ${({ theme }) => (theme.title === 'light' ? '#fff' : theme.colors.background)};
  border-left: 2px solid ${({ theme }) => (theme.title === 'light' ? '#ccc' : '#444')};
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  padding: 2rem 2rem 1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.75rem;
  font-weight: 700;
`;

export const ItemList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 2rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => (theme.title === 'light' ? '#eee' : '#333')};
    border-radius: 10px;
  }
`;

export const CartItem = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: ${({ theme }) => (theme.title === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)')};
  border: 1px solid ${({ theme }) => (theme.title === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)')};

  img {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      text-transform: capitalize;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 700;
    }
  }

  .item-actions {
    display: flex;
    align-items: center;
    background: ${({ theme }) => (theme.title === 'light' ? '#fff' : theme.colors.background)};
    border-radius: 8px;
    padding: 0.25rem;
    gap: 0.75rem;
    border: 1px solid ${({ theme }) => (theme.title === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)')};

    span {
        font-weight: 700;
        min-width: 20px;
        text-align: center;
    }

    button {
      background: none;
      border: none;
      color: ${({ theme }) => theme.colors.primary};
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.2s;
      
      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: #fff;
      }
    }
  }
`;

export const Footer = styled.div`
  border-top: 2px solid ${({ theme }) => (theme.title === 'light' ? '#eee' : '#333')};
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    span {
      font-size: 1.25rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text};
    }

    strong {
      font-size: 2rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const CheckoutButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}44;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${({ theme }) => theme.colors.primary}66;
  }
`;

export const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textDescription};
  gap: 1.5rem;
  text-align: center;

  svg {
    width: 80px;
    height: 80px;
    opacity: 0.15;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 250px;
  }
`;
