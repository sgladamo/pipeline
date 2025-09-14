import { styled, alpha, TableRow } from "@mui/material";

const BlueTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.info.main
      : theme.palette.info.dark,
  ":hover": {
    cursor: "pointer",
    backgroundColor: alpha(
      theme.palette.mode === "light"
        ? theme.palette.info.main
        : theme.palette.info.dark,
      0.75
    ),
  },
}));

export default BlueTableRow;
