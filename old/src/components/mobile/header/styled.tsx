import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  gap: "1rem",
  background: theme.colors.background,
  borderTop: `2px solid #ccc`,
  position: "sticky",
  top: "0",
}))


export const NavMenu = styled("ul")(() => ({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
}))


export const NavItem = styled("li")(() => ({
  listStyle: "none",
}))


export const Link = styled(RouterLink )<{ active?: boolean }>(({ theme, active }) => ({
  color: theme.colors.text,
  fontWeight: "bold",
  textDecoration: "none",

  '&:hover': {
    color: theme.colors.primary
  },

  ...(active && {
    borderBottom: `2px solid ${theme.colors.primary}`,
  }),
}))
