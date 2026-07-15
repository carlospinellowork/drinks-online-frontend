import styled from "styled-components";

export const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  gap: "1rem",
  color: theme.colors.background,
  background: theme.colors.secondary,
  borderTop: `2px solid #ccc`,

  "> div": {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  }
}))