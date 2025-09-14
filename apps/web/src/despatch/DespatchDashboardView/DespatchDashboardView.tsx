import { FullscreenRounded } from "@mui/icons-material";
import {
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  fetchToBePicked,
  fetchLargeShipments,
  fetchPacking,
  fetchCompleted,
} from "despatch/fetch";
import { DESPDashboard } from "despatch/models";
import DefaultTableCell from "core/DefaultTableCell";
import FullScreenDespatchTableDialog from "despatch/FullScreenDespatchTableDialog";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import DespatchTable from "despatch/DespatchTable";
import { CoreContext } from "core/context";
import { requestSearch } from "core/utils";

const tables: string[] = [
  "To Be Picked",
  "Large Shipments",
  "Packing",
  "Completed",
];

export function getLastDespatchColumnName(table: string) {
  switch (table) {
    case "To Be Picked":
      return "Comment";
    case "Completed":
      return "Ready To Collect";
    default:
      return "Status";
  }
}

function DespatchDashboardView() {
  const theme = useTheme();
  const { searchValue } = useContext(CoreContext);

  const [toBePicked, setToBePicked] = useState<DESPDashboard[]>();
  const [largeShipments, setLargeShipments] = useState<DESPDashboard[]>();
  const [packing, setPacking] = useState<DESPDashboard[]>();
  const [completed, setCompleted] = useState<DESPDashboard[]>();
  const [fullScreenTable, setFullScreenTable] = useState<string>();
  const [fullScreenDesp, setFullScreenDesp] = useState<DESPDashboard[]>();
  const [toBePickedState, setToBePickedState] = useState<DESPDashboard[]>([]);
  const [largeShipmentsState, setLargeShipmentsState] = useState<
    DESPDashboard[]
  >([]);
  const [packingState, setPackingState] = useState<DESPDashboard[]>([]);
  const [completedState, setCompletedState] = useState<DESPDashboard[]>([]);

  useLayoutEffect(() => {
    let filtered: DESPDashboard[] = [];
    if (toBePicked) {
      toBePicked.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setToBePickedState(filtered);
  }, [toBePicked, searchValue]);

  useLayoutEffect(() => {
    let filtered: DESPDashboard[] = [];
    if (largeShipments) {
      largeShipments.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setLargeShipmentsState(filtered);
  }, [largeShipments, searchValue]);

  useLayoutEffect(() => {
    let filtered: DESPDashboard[] = [];
    if (packing) {
      packing.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setPackingState(filtered);
  }, [packing, searchValue]);

  useLayoutEffect(() => {
    let filtered: DESPDashboard[] = [];
    if (completed) {
      completed.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setCompletedState(filtered);
  }, [completed, searchValue]);

  useEffect(() => {
    fetchToBePicked().then((data) => setToBePicked(data));
    fetchLargeShipments().then((data) => setLargeShipments(data));
    fetchPacking().then((data) => setPacking(data));
    fetchCompleted().then((data) => setCompleted(data));
  }, []);

  useInterval(() => {
    fetchToBePicked().then((data) => setToBePicked(data));
    fetchLargeShipments().then((data) => setLargeShipments(data));
    fetchPacking().then((data) => setPacking(data));
    fetchCompleted().then((data) => setCompleted(data));
  }, 5000);

  function handleFullScreenDialogOpen(table: string) {
    setFullScreenTable(table);

    if (table === "To Be Picked") {
      setFullScreenDesp(toBePicked);
    } else if (table === "Large Shipments") {
      setFullScreenDesp(largeShipments);
    } else if (table === "Packing") {
      setFullScreenDesp(packing);
    } else if (table === "Completed") {
      setFullScreenDesp(completed);
    }
  }

  function handleFullScreenDialogClose() {
    setFullScreenTable(undefined);
    setFullScreenDesp(undefined);
  }

  function getRowCount(table: string) {
    switch (table) {
      case "To Be Picked":
        return toBePicked?.length;
      case "Large Shipments":
        return largeShipments?.length;
      case "Packing":
        return packing?.length;
      case "Completed":
        return completed?.length;
      default:
        return 0;
    }
  }

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        width: "100vw",
        height: "calc(100% - 38px)",
      }}
    >
      {tables.map((table) => {
        return (
          <Grid
            item
            xs={6}
            key={table}
            height="50%"
            sx={{
              borderLeft:
                tables.indexOf(table) === 0 || tables.indexOf(table) === 2
                  ? `0.5px solid ${theme.palette.divider}`
                  : null,
              borderRight: `0.5px solid ${theme.palette.divider}`,
              borderTop:
                tables.indexOf(table) >= 2
                  ? `0.5px solid ${theme.palette.divider}`
                  : null,
            }}
          >
            <Table
              size="small"
              stickyHeader
              sx={{ borderBottom: `0.5px solid ${theme.palette.divider}` }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    colSpan={7}
                    sx={{ borderBottom: "none" }}
                  >
                    <Stack direction="row">
                      <Chip
                        label={getRowCount(table)}
                        variant="outlined"
                        sx={{ mr: 2, fontWeight: "bold" }}
                        size="small"
                      />
                      <Typography fontSize={16} fontWeight="bold">
                        {table}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="right"
                    colSpan={1}
                    sx={{ borderBottom: "none" }}
                  >
                    <Tooltip title="Fullscreen" disableInteractive>
                      <IconButton
                        sx={{ py: 0 }}
                        onClick={() => handleFullScreenDialogOpen(table)}
                      >
                        <FullscreenRounded
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
                size="small"
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
                      {getLastDespatchColumnName(table)}
                    </DefaultTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    switch (table) {
                      case "To Be Picked":
                        return (
                          <DespatchTable
                            table={table}
                            items={toBePickedState}
                          />
                        );
                      case "Large Shipments":
                        return (
                          <DespatchTable
                            table={table}
                            items={largeShipmentsState}
                          />
                        );
                      case "Packing":
                        return (
                          <DespatchTable table={table} items={packingState} />
                        );
                      case "Completed":
                        return (
                          <DespatchTable table={table} items={completedState} />
                        );
                    }
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        );
      })}
      <FullScreenDespatchTableDialog
        handleDialogClose={handleFullScreenDialogClose}
        table={fullScreenTable}
        desp={fullScreenDesp}
      />
    </Grid>
  );
}

export default DespatchDashboardView;
