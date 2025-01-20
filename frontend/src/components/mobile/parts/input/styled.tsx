import styled from "styled-components";

export const Container = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  svg: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "0.5rem",
    width: "20px",
    height: "20px",
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
    cursor: "pointer",
  }
}))

export const Input = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "0.5rem 1rem 0.5rem 2.5rem",
  borderRadius: "0.5rem",
  border: `1px solid ${theme.title === 'light' ? theme.colors.primary : theme.colors.text}`,
  color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
  outline: "none",
  fontSize: "14px",
  backgroundColor: theme.colors.background,

  "&::placeholder": {
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text
  }
}))