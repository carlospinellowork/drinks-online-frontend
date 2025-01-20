import { Dropdown, Input, type GetProps } from 'antd';
import styled from "styled-components";
const { Search } = Input;


export const Navbar = styled("nav")(() => ({
  height: "100px",
  background: "#eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
}))

export const Logo = styled("div")(() => ({
  width: "fit-content",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  img: {
    width: "100px",
    height: "100px",
  }
}))

export const SearchInput = styled(Search)<GetProps<typeof Search>>(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  borderRadius: "0.5rem",
  border: 'none',
  color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
  outline: "none",
  fontSize: "14px",
  backgroundColor: theme.colors.background, 

  ".ant-input": {
    height: "40px",
  },

  ".ant-input-search-button": {
    width: "40px",
    height: "40px",

    '&:hover': {
      border: `1px solid ${theme.title === 'light' ? theme.colors.primary : theme.colors.text}`,
    }
  },

  "&::placeholder": {
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
  },

 ".ant-input:focus": {
  border: `1px solid ${theme.title === 'light' ? theme.colors.primary : theme.colors.text}`,
 },

 ".ant-input:hover": {
  border: `1px solid ${theme.title === 'light' ? theme.colors.primary : theme.colors.text}`,
 },

}))

export const ProfileContainer = styled("div")(() => ({
  width: "fit-content",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",

  button: {
    width: "fit-content",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    borderRadius: "50%",
    padding: "0.5rem",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  }
}))

export const MenuDropdown = styled(Dropdown)(({ theme }) => ({
  border: "none",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  padding: "0.5rem",
  backgroundColor: theme.colors.background,
}))