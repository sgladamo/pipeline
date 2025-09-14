import { styled, TableRow } from "@mui/material";

const DefaultTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": { border: 0 },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  ":hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.action.focus,
  },
}));

export default DefaultTableRow;
