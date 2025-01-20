import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  gap: "1rem",
}))


export const Title = styled("h1")(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: "2.5rem",
  textTransform: "capitalize",
  fontWeight: "600",
  lineHeight: "3rem",
}))


export const List = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
}))


export const Item = styled("div")(({ theme }) => ({
  display: "flex",
  paddingTop: "1rem",
  alignItems: "center",

  "span.quantity": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2px",
    color: theme.colors.primary,
    fontSize: "14px",
    fontWeight: "600",
  },

  "> div": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: "1",
    gap: "1.5rem",
    cursor: "pointer",

    "> h1": {
      color: theme.colors.text,
      fontSize: "1.5rem",
      textTransform: "capitalize",
      fontWeight: "600",
      lineHeight: "1.5rem",
    },

    "> span": {
      color: theme.title === 'light' ? theme.colors.textDescription : theme.colors.text,
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "1rem",
    },

    "> div": {
      display: "flex",
      alignItems: "center",
      gap: "1rem",

      "> p": {
        color: theme.colors.text,
        fontSize: "18px",
        fontWeight: "600",
        lineHeight: "1rem",
      },

      "> button": {
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.colors.secondary,
        color: theme.colors.background,
        border: "none",
        outline: "none",
        padding: "0.5rem",
        borderRadius: "2px",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: theme.colors.primary,
        },

        '&.trashIcon': {
          padding: "0",
          margin: "0",

          'svg': {
            width: "14px",
            height: "14px",
          },
          backgroundColor: theme.colors.background,
          color: theme.colors.primary,
          cursor: "pointer",
        }
      }
    },
  },

  "img": {
    width: "100px",
    height: "100px",
    borderRadius: "0.5rem",
  }
}))


export const Orders = styled(motion.div)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "20%",
  height: "fit-content",
  padding: "0.5rem",
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  border: `2px solid ${theme.colors.primary}`,
  borderRadius: "5px",
  position: "fixed",
  bottom: "1rem",
  right: "35%",
  gap: "1rem",
  overflowY: "auto",
  overflowX: "hidden",

  "&::-webkit-scrollbar": {
    width: "5px",
    height: "5px",
  },

  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "5px",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "#cecece",
    borderRadius: "5px",
  },

  "> div": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "0.5rem",

    "h1": {
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "1.5rem",
    },

    "button": {
      background: "none",
      border: "none",
      cursor: "pointer",
      marginRight: "15px",

      "svg": {
        color: theme.colors.text,
      }
    }
  },

  "div.orderSumary": {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: "8px",
    width: "100%",
    height: "100%",

    h3: {
      fontSize: "12px",
      fontWeight: "600",
      lineHeight: "1.5rem",
    },
  },

  "div.orderItem": {
    padding: "5px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: "60px",
    borderRadius: "2px",
    gap: "1rem",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",

    "img": {
      width: "50px",
      height: "50px",
      borderRadius: "0.5rem",
    },

    "p": {
      fontSize: "12px",
      color: theme.colors.textDescription,
      lineHeight: "1.5rem",
    },

    "span": {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "1.5rem",
    },
  },

  "> p": {
    fontSize: "20px",
    lineHeight: "1.5rem",
  },

  "> button": {
    width: "100%",
    marginTop: "0 auto",
    backgroundColor: theme.colors.secondary,
    color: theme.colors.background,
    border: "none",
    outline: "none",
    cursor: "pointer",
    padding: "0.5rem",
    borderRadius: "2px",
    transition: "all 0.2s ease-in-out",
    fontWeight: "600",

    "&:hover": {
      backgroundColor: "#cecece",
      color: theme.colors.text,
    },
  },

  "@media (max-width: 768px)": {
    width: "70%",
    right: "1rem",
  }
}))

export const CartToggle = styled("button")(({ theme }) => ({
  display: "flex",
  position: "fixed",
  bottom: "1rem",
  right: "35%",
  width: "50px",
  height: "50px",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.secondary,
  color: theme.colors.background,
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",

  "@media (max-width: 768px)": {
    right: "1rem",
  }
}))