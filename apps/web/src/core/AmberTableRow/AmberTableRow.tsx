import { styled, alpha, TableRow } from "@mui/material";

const AmberTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.warning.main
      : theme.palette.warning.dark,
  ":hover": {
    cursor: "pointer",
    backgroundColor: alpha(
      theme.palette.mode === "light"
        ? theme.palette.warning.main
        : theme.palette.warning.dark,
      0.75
    ),
  },
}));

export default AmberTableRow;
