import { styled, alpha, TableRow } from "@mui/material";

const PurpleTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  backgroundColor: theme.palette.mode === "light" ? "#ba68c8" : "#7b1fa2",
  ":hover": {
    cursor: "pointer",
    backgroundColor: alpha(
      theme.palette.mode === "light" ? "#ba68c8" : "#7b1fa2",
      0.75
    ),
  },
}));

export default PurpleTableRow;
