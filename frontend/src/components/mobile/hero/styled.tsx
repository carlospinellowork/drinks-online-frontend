import styled from "styled-components";

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  background: theme.colors.background,
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",

  'img': {
    width: "250px",
    height: "250px",
    alignSelf: "center",
  },
}))

export const Title = styled("h1")(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: "2.5rem",
  textTransform: "capitalize",
  fontWeight: "600",
  lineHeight: "3rem",

}))

export const Text = styled("p")(({ theme }) => ({
  color: theme.colors.secondary,
  fontSize: "12px",
  fontWeight: "600",
  marginTop: "15px",
}))

export const Address = styled("p")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: theme.colors.text,
  fontSize: "1rem",
  fontWeight: "600",
  marginTop: "15px",

  "svg": {
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text
  }
}))

export const Link = styled("a")(({ theme }) => ({
  color: theme.title === 'light' ? theme.colors.secondary : theme.colors.text,
  textDecoration: "none",

  ".social-medias": {
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
    fontSize: "1rem",
  }
}))

export const SocialMedias = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  marginTop: "15px",
  gap: "15px",

  'div': {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 0",

    'svg': {
      width: "20px",
      height: "20px",
      color: theme.title === 'light' ? theme.colors.primary : theme.colors.text
    },
  }
}))

export const Button = styled("button")(({ theme }) => ({
  background: theme.colors.primary,
  color: theme.title === 'light' ? theme.colors.background : theme.colors.text,
  fontSize: "14px",
  fontWeight: "600",
  border: "none",
  padding: "10px 20px",
  borderRadius: "2px",
  marginTop: "15px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  
  "&:hover": {
    background: theme.title === 'light' ? theme.colors.secondary : theme.colors.primary
  },

}))

export const ToggleButton = styled("button")<{ isDarkMode: boolean }>(({ theme, isDarkMode }) => ({
  backgroundColor: theme.colors.background,
  border: `1px solid ${theme.title === 'light' ? theme.colors.primary : theme.colors.text}`,
  borderRadius: "20px",
  cursor: "pointer",
  padding: "5px 10px",
  fontSize: "10px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "5px",

  "p": {
    color: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
    fontWeight: "600",
    transition: "transform 0.3s ease",
    transform: isDarkMode ? 'translateX(-20px)' : 'translateX(0)',
  },
}));

export const ToggleSwitch = styled("span")<{ isDarkMode: boolean }>(({ theme, isDarkMode }) => ({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: theme.title === 'light' ? theme.colors.primary : theme.colors.text,
  transition: "transform 0.3s ease",
  boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)",
  transform: isDarkMode ? 'translateX(60px)' : 'translateX(0)',
}));