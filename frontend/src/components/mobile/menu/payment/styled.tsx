import styled from "styled-components";

export const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "1rem",
  gap: "1rem",

  '.header': {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  '.switchPayment': {
    width: "100%",
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",

    'label': {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
  },

  'button.saveButton': {
    width: "100%",
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
  }

}))
