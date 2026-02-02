import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textDescription};
`;

const StyledSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.colors.primary} !important;
  }
`;

export const Loading = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  return (
    <Container>
      <StyledSpin indicator={antIcon} />
      <span>Carregando drinks...</span>
    </Container>
  );
};
