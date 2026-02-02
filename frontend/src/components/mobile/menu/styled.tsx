import { motion } from "framer-motion";
import styled from "styled-components";

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
  gap: "1rem",
}))


export const Item = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem",
  gap: "1rem",
  backgroundColor: theme.title === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.05)',
  borderRadius: "16px",
  boxShadow: theme.title === 'light'
    ? "0 4px 12px rgba(0, 0, 0, 0.05)"
    : "0 4px 12px rgba(0, 0, 0, 0.2)",
  border: `1px solid ${theme.title === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,

  "> div:first-of-type": {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    gap: "0.5rem",
    overflow: "hidden",

    "> h1": {
      color: theme.colors.text,
      fontSize: "1rem",
      fontWeight: "700",
      margin: 0,
      lineHeight: "1.2",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },

    "> span": {
      color: theme.colors.textDescription,
      fontSize: "0.8rem",
      lineHeight: "1.3",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },

    ".actions": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "0.5rem",
      paddingRight: "0.5rem",

      ".price": {
        color: theme.colors.primary,
        fontSize: "1rem",
        fontWeight: "700",
        margin: 0,
      },

      ".add-btn": {
        backgroundColor: theme.colors.primary,
        color: "#fff",
        border: "none",
        fontSize: "0.8rem",
        fontWeight: "600",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "opacity 0.2s",
        "&:active": { opacity: 0.8 },
      },

      ".qty-control": {
        display: "flex",
        alignItems: "center",
        gap: "0.8rem",
        backgroundColor: theme.title === 'light' ? "#f5f5f5" : "rgba(255,255,255,0.1)",
        padding: "0.25rem",
        borderRadius: "8px",

        "button": {
          minWidth: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem",

          "&.remove": {
            backgroundColor: "#fff",
            color: "#ff4d4f",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            "svg": { width: "14px", height: "14px" }
          },

          "&.add": {
            backgroundColor: theme.colors.primary,
            color: "#fff",
          }
        },

        "span": {
          fontSize: "0.9rem",
          fontWeight: "600",
          color: theme.colors.text,
          minWidth: "16px",
          textAlign: "center",
        }
      }
    }
  },

  "img": {
    width: "90px",
    height: "90px",
    borderRadius: "12px",
    objectFit: "cover",
    flexShrink: 0,
    backgroundColor: theme.colors.background,
  }
}))


export const Orders = styled(motion.div)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "500px",
  height: "85vh",
  padding: "1.5rem",
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  borderRadius: "20px 20px 0 0",
  position: "fixed",
  bottom: "0",
  left: "50%",
  transform: "translateX(-50%)",
  gap: "1.5rem",
  boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
  zIndex: 1000,
  overflow: "hidden",

  "@media (min-width: 769px)": {
    width: "400px",
    right: "2rem",
    left: "auto",
    bottom: "2rem",
    borderRadius: "16px",
    height: "auto",
    maxHeight: "80vh",
    transform: "none",
  },

  "> div:first-of-type": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottom: `1px solid ${theme.title === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
    paddingBottom: "1rem",

    "h1": {
      fontSize: "1.25rem",
      fontWeight: "700",
      margin: 0,
    },

    "button": {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "background 0.2s",

      "&:hover": {
        background: theme.title === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
      },

      "svg": {
        color: theme.colors.text,
        width: "24px",
        height: "24px",
      }
    }
  },

  "div.orderSumary": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    flex: 1,
    overflowY: "auto",
    paddingRight: "0.5rem",

    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.title === 'light' ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
      borderRadius: "4px",
    },
  },

  "div.orderItem": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "0.5rem",
    borderRadius: "12px",
    background: theme.title === 'light' ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.05)",
    gap: "1rem",

    "img": {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
    },

    "p": {
      fontSize: "0.95rem",
      color: theme.colors.text,
      flex: 1,
      margin: 0,
      fontWeight: "500",
    },

    "span": {
      fontSize: "0.95rem",
      fontWeight: "700",
      color: theme.colors.primary,
    },
  },

  "> div:last-child": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "auto",
    paddingTop: "1rem",
    borderTop: `1px solid ${theme.title === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
  },

  "p.total": {
    fontSize: "1.25rem",
    fontWeight: "700",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
  },

  "> button.checkout-btn": {
    width: "100%",
    backgroundColor: theme.colors.primary,
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    fontWeight: "700",
    padding: "1rem",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: `0 4px 12px ${theme.colors.primary}40`,

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: `0 6px 16px ${theme.colors.primary}60`,
    },
  },
}))

export const CartToggle = styled("button")(({ theme }) => ({
  display: "flex",
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
  width: "60px",
  height: "60px",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.primary,
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  zIndex: 999,
  transition: "transform 0.2s",

  "&:hover": {
    transform: "scale(1.05)",
  },

  "svg": {
    width: "28px",
    height: "28px",
  }
}))