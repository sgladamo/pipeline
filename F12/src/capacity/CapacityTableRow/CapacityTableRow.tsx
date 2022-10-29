import { styled, TableRow } from "@mui/material";

const CapacityTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default CapacityTableRow;
