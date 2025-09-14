import { styled, Button } from "@mui/material";

const DefaultOutlinedButton = styled(Button)(({ theme }) => ({
  height: "48px",
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  ":hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export default DefaultOutlinedButton;
