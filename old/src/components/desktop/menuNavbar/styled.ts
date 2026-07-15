import { Dropdown, Input, type GetProps } from 'antd';
import styled from "styled-components";
const { Search } = Input;


export const Navbar = styled("nav")(({ theme }) => ({
  height: "80px",
  background: theme.colors.background,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
  borderBottom: `2px solid ${theme.title === 'light' ? '#ccc' : '#444'}`,
}))

export const Logo = styled("div")(() => ({
  width: "fit-content",
  height: "80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  img: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  }
}))

export const SearchInput = styled(Search)<GetProps<typeof Search>>(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",

  ".ant-input-wrapper": {
    display: "flex",
    alignItems: "stretch",
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${theme.title === 'light' ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'}`,
    transition: "border-color 0.2s",
    background: theme.colors.background,

    "&:hover, &:focus-within": {
      borderColor: theme.colors.primary,
    },
  },

  ".ant-input-affix-wrapper": {
    background: "transparent !important",
    border: "none !important",
    boxShadow: "none !important",
    padding: "0 0 0 1rem !important",
    flex: 1,
    display: "flex",
    alignItems: "center",

    "&:hover, &:focus, &.ant-input-affix-wrapper-focused": {
      border: "none !important",
      boxShadow: "none !important",
    },

    ".ant-input": {
      background: "transparent !important",
      border: "none !important",
      boxShadow: "none !important",
      padding: "0 !important",
      margin: "0 !important",
      height: "42px",
      color: theme.colors.text,
      fontSize: "14px",

      "&::placeholder": {
        color: theme.title === 'light' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)',
      },
    }
  },

  ".ant-input-group-addon": {
    display: "none",
  },

  ".ant-input-search-button": {
    width: "46px !important",
    height: "42px !important",
    border: "none !important",
    borderRadius: "0 !important",
    borderLeft: `1px solid ${theme.title === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)'} !important`,
    background: theme.title === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
    color: theme.title === 'light' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 !important",
    margin: "0 !important",
    boxShadow: "none !important",

    "&:hover": {
      background: `${theme.colors.primary} !important`,
      color: "#fff !important",
    },

    svg: {
      width: "18px",
      height: "18px",
    }
  },
}))

export const ProfileContainer = styled("div")(({ theme }) => ({
  width: "fit-content",
  height: "80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",

  button: {
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    borderRadius: "50%",
    background: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    transition: "background 0.3s",

    svg: {
      fill: theme.title === 'light' ? "#262626" : '#fff',
      stroke: theme.title === 'light' ? "#262626" : '#fff',
    },

    "&:hover": {
        background: theme.title === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
    }
  }
}))

export const MenuDropdown = styled(Dropdown)(({ theme }) => ({
  border: "none",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  padding: "0.5rem",
  backgroundColor: theme.colors.background,
}))