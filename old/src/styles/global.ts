import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    box-sizing: border-box;
    background: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    color: ${({ theme }) => theme.colors.text};
    font-family: sans-serif;
    font-size: 14px;
  }
`;
