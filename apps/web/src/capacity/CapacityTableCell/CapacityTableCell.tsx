import { styled, TableCell, tableCellClasses } from "@mui/material";

const CapacityTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    borderRight: `0.5px solid ${theme.palette.divider}`,
  },
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default CapacityTableCell;
