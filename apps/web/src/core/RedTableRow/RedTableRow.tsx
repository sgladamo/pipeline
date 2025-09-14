import { styled, alpha, TableRow } from "@mui/material";

const RedTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.error.main
      : theme.palette.error.dark,
  ":hover": {
    cursor: "pointer",
    backgroundColor: alpha(
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
      0.75
    ),
  },
}));

export default RedTableRow;
