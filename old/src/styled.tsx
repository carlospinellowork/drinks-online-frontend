import styled from "styled-components";

export const Layout = styled("div")(({ theme }) => ({
  backgroundColor: theme.colors.background,
  color: theme.colors.text,

  width: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))