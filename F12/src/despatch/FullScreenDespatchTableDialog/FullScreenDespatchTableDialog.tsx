import { FullscreenExitRounded } from "@mui/icons-material";
import {
  Dialog,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { DESPDashboard } from "despatch/models";
import DefaultTableCell from "core/DefaultTableCell";
import GreenTableRow from "core/GreenTableRow";
import RedTableRow from "core/RedTableRow";
import DespatchTableRow from "despatch/DespatchTableRow";
import { getLastDespatchColumnName } from "despatch/DespatchDashboardView/DespatchDashboardView";

interface FullScreenDespatchTableDialogProps {
  handleDialogClose: () => void;
  table: string | undefined;
  desp: DESPDashboard[] | undefined;
}

function FullScreenDespatchTableDialog(
  props: FullScreenDespatchTableDialogProps
) {
  const { handleDialogClose, table, desp } = props;
  const theme = useTheme();

  return (
    <Dialog
      onClose={handleDialogClose}
      open={Boolean(table)}
      maxWidth={false}
      fullWidth
      fullScreen
    >
      <Table
        size="small"
        stickyHeader
        sx={{ borderBottom: `0.5px solid ${theme.palette.divider}` }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="left" colSpan={7} sx={{ borderBottom: "none" }}>
              <Stack direction="row">
                <Chip
                  label={desp?.length}
                  variant="outlined"
                  sx={{ mr: 2, fontWeight: "bold" }}
                  size="small"
                />
                <Typography fontSize={16} fontWeight="bold">
                  {table}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="right" colSpan={1} sx={{ borderBottom: "none" }}>
              <Tooltip title="Exit Fullscreen" disableInteractive>
                <IconButton onClick={handleDialogClose}>
                  <FullscreenExitRounded
                    fontSize="medium"
                    htmlColor={theme.palette.text.primary}
                  />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 0,
          height: "100%",
          backgroundImage: "none",
        }}
      >
        <Table
          size="medium"
          stickyHeader
          sx={{
            borderBottom: `0.5px solid ${theme.palette.divider}`,
          }}
        >
          <TableHead>
            <TableRow>
              <DefaultTableCell>Despatch</DefaultTableCell>
              <DefaultTableCell>Sales Order</DefaultTableCell>
              <DefaultTableCell>Priority</DefaultTableCell>
              <DefaultTableCell>Packing Instructions</DefaultTableCell>
              <DefaultTableCell>Account No.</DefaultTableCell>
              <DefaultTableCell>Customer</DefaultTableCell>
              <DefaultTableCell>Ship Date</DefaultTableCell>
              <DefaultTableCell>
                {getLastDespatchColumnName(table as string)}
              </DefaultTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {desp?.map((item) => {
              if (item && item.actualDeliveryDate) {
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                if (new Date(item.actualDeliveryDate.toString()) >= today) {
                  return (
                    <GreenTableRow key={item.dispatchNote}>
                      <DespatchTableRow table={table as string} item={item} />
                    </GreenTableRow>
                  );
                } else {
                  return (
                    <RedTableRow key={item.dispatchNote}>
                      <DespatchTableRow table={table as string} item={item} />
                    </RedTableRow>
                  );
                }
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}

export default FullScreenDespatchTableDialog;
