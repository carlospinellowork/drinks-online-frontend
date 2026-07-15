import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  paddingBottom: "1rem",
  background: theme.colors.background,
  borderBottom: `1px solid ${theme.title === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
  position: "relative",
}));

export const Banner = styled("div")(({ theme }) => ({
  width: "100%",
  height: "140px",
  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 0,
}));

export const ThemeButton = styled("button")(({ theme }) => ({
  position: "absolute",
  top: "1rem",
  right: "1rem",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(4px)",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 1,
  color: "#fff",
  transition: "all 0.2s",

  "&:hover": {
    background: "rgba(255, 255, 255, 0.3)",
    transform: "scale(1.05)",
  },

  "svg": {
    width: "20px",
    height: "20px",
  }
}));

export const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "0 1.5rem",
  marginTop: "80px", // To overlap banner
  zIndex: 1,
}));

export const LogoWrapper = styled(motion.div)(({ theme }) => ({
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: theme.colors.background,
  padding: "4px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "img": {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  }
}));

export const Title = styled("h1")(({ theme }) => ({
  color: theme.colors.text,
  fontSize: "1.75rem",
  fontWeight: "800",
  marginTop: "1rem",
  textAlign: "center",
  lineHeight: "1.2",
}));

export const Address = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  color: theme.colors.textDescription,
  fontSize: "0.9rem",
  fontWeight: "500",
  marginTop: "0.5rem",
  textDecoration: "none",
  textAlign: "center",
  width: "100%",

  "svg": {
    color: theme.colors.primary,
    width: "16px",
    height: "16px",
  }
}));

export const Description = styled("p")(({ theme }) => ({
  color: theme.colors.textDescription,
  fontSize: "0.9rem",
  textAlign: "center",
  lineHeight: "1.5",
  marginTop: "1rem",
  padding: "0 0.5rem",
}))

export const ActionsRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  width: "100%",
  marginTop: "1.5rem",
}));

export const ActionButton = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "45px",
  height: "45px",
  borderRadius: "12px",
  background: theme.title === 'light' ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)",
  color: theme.colors.primary,
  textDecoration: "none",
  transition: "all 0.2s",

  "&:hover": {
    background: theme.colors.primary,
    color: "#fff",
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${theme.colors.primary}40`,
  },

  "svg": {
    width: "20px",
    height: "20px",
  }
}));

export const InfoButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
  marginTop: "1.5rem",
  background: theme.title === 'light' ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "left",

  "div": {
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    "strong": {
      color: theme.colors.text,
      fontSize: "0.95rem",
    },

    "span": {
      color: theme.colors.textDescription,
      fontSize: "0.85rem",
      lineHeight: "1.3",
    }
  },

  "svg": {
    color: theme.colors.primary,
    transform: "rotate(-90deg)",
  }
}));

export const Divider = styled("div")(({ theme }) => ({
  width: "100%",
  height: "1px",
  background: theme.title === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
  margin: "1.5rem 0",
}));