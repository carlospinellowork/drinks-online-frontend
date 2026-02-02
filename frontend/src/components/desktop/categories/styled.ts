import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => (theme.title === 'light' ? '#fff' : theme.colors.background)};
  border-bottom: 2px solid ${({ theme }) => (theme.title === 'light' ? '#ccc' : '#444')};
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryItem = styled.div<{ active: boolean }>`
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.text)};
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background: ${({ active, theme }) => (active ? theme.colors.primary : 'rgba(0, 0, 0, 0.05)')};
  }
`;
