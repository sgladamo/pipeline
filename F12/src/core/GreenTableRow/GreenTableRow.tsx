import { styled, alpha, TableRow } from "@mui/material";

const GreenTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.success.main
      : theme.palette.success.dark,
  ":hover": {
    cursor: "pointer",
    backgroundColor: alpha(
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
      0.75
    ),
  },
}));

export default GreenTableRow;
