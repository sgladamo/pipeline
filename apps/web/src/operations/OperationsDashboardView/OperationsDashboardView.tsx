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
import { WipJobAllLab } from "core/models";
import { WipCurrentOp, DashboardTable } from "operations/models";
import { useState, useEffect, useContext, useLayoutEffect } from "react";
import { useInterval } from "usehooks-ts";
import AllOperationsDialog from "operations/AllOperationsDialog";
import {
  FullscreenRounded,
  InsightsRounded,
  ViewCompactRounded,
} from "@mui/icons-material";
import FullScreenTableDialog from "operations/FullScreenWipTableDialog";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import { fetchCurrentOps, fetchJobAllOps } from "operations/fetch";
import { useNavigate } from "react-router-dom";
import DashboardFab from "core/DashboardFab";
import { CoreContext } from "core/context";
import { requestSearch } from "core/utils";

const tables: DashboardTable[] = [
  { name: "Picking", workCentres: ["SA02", "PICK01"] },
  { name: "Trolley Storage", workCentres: ["TRST01", "TROL01"] },
  {
    name: "Assembly Cells",
    workCentres: [
      "ASSY01",
      "CELL01",
      "CELL02",
      "CELL03",
      "CELL04",
      "CELL05",
      "CELL06",
      "CELL07",
    ],
  },
  {
    name: "Boxing & Labelling",
    workCentres: ["SA01", "BOXI01"],
  },
  { name: "Quality Testing", workCentres: ["TEST01", "CELL12", "CELL14"] },
  { name: "Return to Stores", workCentres: ["PASA01", "PASA02", "MOVE02"] },
  { name: "Move To Warehouse A", workCentres: ["MOVE01"] },
  {
    name: "Goods Returned for Repair",
    workCentres: ["REPA01"],
  },
];

export function getLastColumnName(name: string) {
  switch (name) {
    case "Assembly Cells":
      return "Cell";
    case "Return to Stores":
      return "Bin";
    case "Move To Warehouse A":
      return "Bin";
    default:
      return "Next Op";
  }
}

export function getLastColumnValue(table: DashboardTable, op: WipCurrentOp) {
  switch (table.name) {
    case "Assembly Cells":
      return op.workCentre !== "ASSY01" ? op.nextWorkCentre : op.iMachine;
    case "Return to Stores":
      return op.defaultBin;
    case "Move To Warehouse A":
      return op.defaultBin;
    default:
      return table.workCentres.find((wc) => wc === "TROL01")
        ? op.nextWorkCentreIMachine
        : op.nextWorkCentre;
  }
}

interface OperationsDashboardViewProps {
  hideKPIs?: boolean;
}

function OperationsDashboardView(props: OperationsDashboardViewProps) {
  const { hideKPIs } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { searchValue } = useContext(CoreContext);

  const [opsState, setOpsState] = useState<WipCurrentOp[]>([]);
  const [currentOps, setCurrentOps] = useState<WipCurrentOp[]>();
  const [selectedJob, setSelectedJob] = useState<WipCurrentOp>();
  const [selectedJobAllOperations, setSelectedJobAllOperations] =
    useState<WipJobAllLab[]>();
  const [selectedTable, setSelectedTable] = useState<DashboardTable>();
  const [selectedTableOps, setSelectedTableOps] = useState<WipCurrentOp[]>();

  useLayoutEffect(() => {
    let filtered: WipCurrentOp[] = [];
    if (currentOps) {
      currentOps.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setOpsState(filtered);
  }, [currentOps, searchValue]);

  useEffect(() => {
    fetchCurrentOps().then((data) => setCurrentOps(data));
  }, []);

  useInterval(() => {
    fetchCurrentOps().then((data) => setCurrentOps(data));
  }, 2500);

  function handleOnJobSelection(op: WipCurrentOp) {
    fetchJobAllOps(op).then((data) => {
      setSelectedJob(op);
      setSelectedJobAllOperations(data);
    });
  }

  function handleAllJobsDialogClose() {
    setSelectedJob(undefined);
    setTimeout(() => setSelectedJobAllOperations(undefined), 500);
  }

  function handleSetFullScreenTable(table: DashboardTable) {
    setSelectedTable(table);
    let ops: WipCurrentOp[] = [];
    currentOps?.forEach((op) => {
      if (table.workCentres.find((wc) => wc === op.workCentre)) {
        ops.push(op);
      }
    });
    setSelectedTableOps(ops);
  }

  function handleFullScreenDialogClose() {
    setSelectedTable(undefined);
    setSelectedTableOps(undefined);
    fetchCurrentOps().then((data) => setCurrentOps(data));
  }

  function getRowCount(table: DashboardTable) {
    let counter = 0;
    currentOps?.forEach((op) => {
      if (table.workCentres.find((wc) => wc === op.workCentre)) {
        counter++;
      }
    });
    return counter;
  }

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        width: "100vw",
        height: "calc(100% - 40px)",
      }}
    >
      {tables.map((table) => {
        return (
          <Grid
            item
            xs={3}
            key={table.name}
            height="50%"
            sx={{
              borderTop:
                tables.indexOf(table) >= 4
                  ? `0.5px solid ${theme.palette.divider}`
                  : null,
              borderRight:
                tables.indexOf(table) === 3 || tables.indexOf(table) === 7
                  ? null
                  : `0.5px solid ${theme.palette.divider}`,
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
                        {table.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="right"
                    colSpan={1}
                    sx={{ borderBottom: "none" }}
                  >
                    {table.name === "Assembly Cells" && (
                      <Tooltip title="View" disableInteractive>
                        <IconButton
                          sx={{ py: 0 }}
                          onClick={() => {
                            if (table.name === "Assembly Cells") {
                              navigate("/assembly");
                            }
                          }}
                        >
                          <ViewCompactRounded
                            fontSize="medium"
                            htmlColor={theme.palette.text.primary}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Fullscreen" disableInteractive>
                      <IconButton
                        onClick={() => handleSetFullScreenTable(table)}
                        sx={{ py: 0 }}
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
                    <DefaultTableCell>Job</DefaultTableCell>
                    <DefaultTableCell>Code</DefaultTableCell>
                    <DefaultTableCell>Description</DefaultTableCell>
                    <DefaultTableCell>Qty</DefaultTableCell>
                    <DefaultTableCell>Priority</DefaultTableCell>
                    <DefaultTableCell>Purpose</DefaultTableCell>
                    <DefaultTableCell>
                      {getLastColumnName(table.name)}
                    </DefaultTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opsState?.map((op) => {
                    if (table.workCentres.find((wc) => wc === op.workCentre)) {
                      return (
                        <DefaultTableRow
                          key={op.job}
                          onClick={() => handleOnJobSelection(op)}
                        >
                          <DefaultTableCell component="th" scope="row">
                            {op.job?.replace("000000000", "")}
                          </DefaultTableCell>
                          <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                          <DefaultTableCell>
                            {table.name === "Goods Returned for Repair"
                              ? op.jobDescription
                              : op.stockDescription}
                          </DefaultTableCell>
                          <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                          <DefaultTableCell>{op.priority}</DefaultTableCell>
                          <DefaultTableCell>
                            {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                          </DefaultTableCell>
                          <DefaultTableCell>
                            {getLastColumnValue(table, op)}
                          </DefaultTableCell>
                        </DefaultTableRow>
                      );
                    } else {
                      return null;
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        );
      })}
      {!hideKPIs && (
        <DashboardFab
          action={() => navigate("/operations/kpis")}
          tooltip="View Operations KPIs"
          icon={<InsightsRounded />}
        />
      )}
      <FullScreenTableDialog
        handleDialogClose={handleFullScreenDialogClose}
        table={selectedTable}
        ops={selectedTableOps}
        setOps={setSelectedTableOps}
        editCells={
          selectedTable?.name === "Assembly Cells" ||
          selectedTable?.name === "Trolley Storage"
        }
      />
      <AllOperationsDialog
        handleDialogClose={handleAllJobsDialogClose}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        allOperations={selectedJobAllOperations}
        setAllOperations={setSelectedJobAllOperations}
      />
    </Grid>
  );
}

export default OperationsDashboardView;
