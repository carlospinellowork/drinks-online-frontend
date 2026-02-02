import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  flex: 1;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

export const Card = styled.div`
  display: flex;
  background: ${({ theme }) => (theme.title === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.05)')};
  padding: 1.25rem;
  gap: 1.5rem;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => (theme.title === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)')};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 110px;
    height: 110px;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 0.75rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    text-transform: capitalize;
    font-weight: 600;
    margin: 0;
  }

  span {
    color: ${({ theme }) => (theme.title === 'light' ? theme.colors.textDescription : 'rgba(255, 255, 255, 0.7)')};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 0.5rem;

    p {
      color: ${({ theme }) => theme.colors.text};
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const QuantityBadge = styled.span`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  margin-left: 1rem;
`;
