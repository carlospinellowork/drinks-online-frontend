import styled from "styled-components";

export const Container = styled("div")(() => ({
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(0, 0, 0, 0.5)",

  zIndex: 9999,
}))

export const Box = styled("div")(({ theme }) => ({
  display: "flex",
  width: "350px",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "2rem",
  borderRadius: "0.5rem",
  background: theme.colors.background,
}))

export const Header = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  background: theme.colors.background,

  h1: {
    color: theme.colors.text,
    fontSize: "1.5rem",
    fontWeight: "600",
  },

  button: {
    background: "transparent",
    border: "none",
    outline: "none",
    cursor: "pointer",

    svg: {
      width: "25px",
      height: "25px",
      color: theme.colors.text,
    },
    
    "&:hover": {
      svg: {
        color: theme.colors.primary
      }
    },
  },
}))

export const Content = styled("div")(({ theme }) => ({  
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "1rem",
  background: theme.colors.background,

  div: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    background: theme.colors.background,

    h3: {
      color: theme.colors.text,
      fontSize: "1rem",
      fontWeight: "600",
    },

    p: {
      color: theme.colors.text,
      fontSize: "0.8rem",
    }
  }
}))