import {
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DashboardTable, WipCurrentOp } from "operations/models";
import { useInterval } from "usehooks-ts";
import AllOperationsDialog from "operations/AllOperationsDialog";
import { FullscreenRounded } from "@mui/icons-material";
import { CoreContext } from "core/context";
import DefaultTableCell from "core/DefaultTableCell";
import {
  fetchWipAssemblyOps,
  fetchTrolleyStorageOps,
  fetchJobAllOps,
  updateJobPriority,
  updateJobCell,
} from "operations/fetch";
import CellTableBody from "operations/CellTableBody";
import OtherTableBody from "operations/OtherTableBody/OtherTableBody";
import { OtherCells } from "core/consts";
import FullScreenAssemblyCellDialog from "operations/FullScreenAssemblyCellDialog";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { WipJobAllLab } from "core/models";

const cells: DashboardTable[] = [
  { name: "CELL01", workCentres: [] },
  { name: "CELL02", workCentres: [] },
  { name: "CELL03", workCentres: [] },
  { name: "CELL04", workCentres: [] },
  { name: "CELL05", workCentres: [] },
  { name: "CELL06", workCentres: [] },
  { name: "CELL07", workCentres: [] },
  { name: "Other", workCentres: [] },
];

function AssemblyDashboardView() {
  const { loggedIn } = useContext(CoreContext);
  const theme = useTheme();

  const [assemblyOps, setAssemblyOps] = useState<WipCurrentOp[]>();
  const [trolleyStorageOps, setTrolleyStorageOps] = useState<WipCurrentOp[]>();
  const [selectedJob, setSelectedJob] = useState<WipCurrentOp>();
  const [selectedJobAllOperations, setSelectedJobAllOperations] =
    useState<WipJobAllLab[]>();
  const [selectedTable, setSelectedTable] = useState<DashboardTable>();
  const [selectedTableOps, setSelectedTableOps] = useState<WipCurrentOp[]>();

  useEffect(() => {
    fetchWipAssemblyOps().then((data) => setAssemblyOps(data));
    fetchTrolleyStorageOps().then((data) => setTrolleyStorageOps(data));
  }, []);

  useInterval(() => {
    fetchWipAssemblyOps().then((data) => setAssemblyOps(data));
    fetchTrolleyStorageOps().then((data) => setTrolleyStorageOps(data));
  }, 2500);

  function handleOnJobSelection(op: WipCurrentOp) {
    fetchJobAllOps(op).then((data) => {
      setSelectedJob(op);
      setSelectedJobAllOperations(data);
    });
  }

  function handleDialogClose() {
    setSelectedJob(undefined);
    setTimeout(() => setSelectedJobAllOperations(undefined), 500);
  }

  function handleSetFullScreenTable(table: DashboardTable) {
    setSelectedTable(table);
    let ops: WipCurrentOp[] = [];
    if (table.name !== "Other") {
      assemblyOps?.forEach((op) => {
        if (table.name === op.workCentre || table.name === op.iMachine)
          ops.push(op);
      });
      trolleyStorageOps?.forEach((op) => {
        if (
          table.name === op.nextWorkCentre ||
          table.name === op.nextWorkCentreIMachine
        ) {
          ops.push(op);
        }
      });
    } else {
      assemblyOps?.forEach((op) => {
        if (
          op.holdFlag === "Y" ||
          OtherCells.find((x) => x === op.workCentre || x === op.iMachine)
        ) {
          ops.push(op);
        }
      });
    }
    setSelectedTableOps(ops);
  }

  function handleFullScreenDialogClose() {
    setSelectedTable(undefined);
    setSelectedTableOps(undefined);
  }

  function getRowCount(table: DashboardTable) {
    let counter = 0;
    assemblyOps?.forEach((op) => {
      if (table.name === op.workCentre || table.name === op.iMachine) {
        counter++;
      }
    });
    trolleyStorageOps?.forEach((op) => {
      if (
        table.name === op.nextWorkCentre ||
        table.name === op.nextWorkCentreIMachine
      ) {
        counter++;
      }
    });
    return counter;
  }

  function handleOnDragEnd(result: DropResult) {
    console.log(result);
    if (trolleyStorageOps) {
      let currentCell = trolleyStorageOps.find(
        (x) => x.job === result.draggableId
      )?.nextWorkCentreIMachine;

      if (
        loggedIn &&
        currentCell &&
        result.destination &&
        result.source.index !== result.destination.index
      ) {
        if (result.destination.droppableId === currentCell) {
          handleLocalMove(currentCell, result);
        } else {
          handleCellMove(result.destination.droppableId, result);
        }
      }
    }
  }

  function handleLocalMove(currentCell: string, result: DropResult) {
    let trolleyStorageOpsCopy: WipCurrentOp[] = JSON.parse(
      JSON.stringify(trolleyStorageOps)
    );
    trolleyStorageOpsCopy = trolleyStorageOpsCopy.filter(
      (op) => op.nextWorkCentreIMachine === currentCell
    );
    let op = trolleyStorageOpsCopy.find((x) => x.job === result.draggableId);
    trolleyStorageOpsCopy = trolleyStorageOpsCopy.filter(
      (op) => op.job !== result.draggableId
    );
    if (result.destination && op) {
      trolleyStorageOpsCopy.splice(result.destination?.index, 0, op);
    }

    // If first
    if (result.destination && result.destination.index === 0) {
      let infrontJob = trolleyStorageOpsCopy[1];
      if (infrontJob) {
        const newPriority = infrontJob.priority as number;
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );

        let oX = trolleyStorageOpsCopy1.filter(
          (x) => x.nextWorkCentreIMachine === currentCell
        );

        oX.forEach((o) => {
          if (o.job === result.draggableId) {
            updateJobPriority(o.job, newPriority);
            o.priority = newPriority;
          } else {
            updateJobPriority(o.job as string, (o.priority as number) + 1);
            (o.priority as number)++;
          }
        });

        trolleyStorageOpsCopy1.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        setTrolleyStorageOps(trolleyStorageOpsCopy1);
      }
    }
    // If last
    else if (
      result.destination &&
      result.destination.index === trolleyStorageOpsCopy.length - 1
    ) {
      let behindJob = trolleyStorageOpsCopy[trolleyStorageOpsCopy.length - 2];
      if (op && op.job && behindJob) {
        const newPriority = (behindJob.priority as number) + 1;
        updateJobPriority(op.job, newPriority);
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );
        let o = trolleyStorageOpsCopy1.find((x) => x.job === op?.job);
        if (o) {
          o.priority = newPriority;
          trolleyStorageOpsCopy1.sort(
            (a, b) => (a.priority as number) - (b.priority as number)
          );
          setTrolleyStorageOps(trolleyStorageOpsCopy1);
        }
      }
    }
    // If in between
    else if (result.destination) {
      let behindJob = trolleyStorageOpsCopy[result.destination.index - 1];
      if (behindJob) {
        const newPriority = (behindJob.priority as number) + 1;
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );
        let oX = trolleyStorageOpsCopy1.filter(
          (x) => x.nextWorkCentreIMachine === currentCell
        );
        oX.forEach((o, index) => {
          if (o.job === result.draggableId) {
            updateJobPriority(o.job, newPriority);
            o.priority = newPriority;
          } else if (result.destination && index >= result.destination?.index) {
            updateJobPriority(o.job as string, (o.priority as number) + 1);
            (o.priority as number)++;
          }
        });
        trolleyStorageOpsCopy1.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        setTrolleyStorageOps(trolleyStorageOpsCopy1);
      }
    }
  }

  function handleCellMove(newCell: string, result: DropResult) {
    let trolleyStorageOpsCopy: WipCurrentOp[] = JSON.parse(
      JSON.stringify(trolleyStorageOps)
    );
    let op = {
      ...trolleyStorageOpsCopy.find((x) => x.job === result.draggableId),
    };
    trolleyStorageOpsCopy = trolleyStorageOpsCopy.filter(
      (op) => op.nextWorkCentreIMachine === newCell
    );
    if (result.destination && op) {
      trolleyStorageOpsCopy.splice(result.destination?.index, 0, op);
    }

    // If first
    if (result.destination && result.destination.index === 0) {
      let infrontJob = trolleyStorageOpsCopy[1];
      if (infrontJob) {
        const newPriority = infrontJob.priority as number;
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );
        trolleyStorageOpsCopy.forEach((o) => {
          if (o.job === result.draggableId) {
            updateJobCell(o.job, newCell);
            updateJobPriority(o.job, newPriority);
            let o1 = trolleyStorageOpsCopy1.find((x) => x.job === o.job);
            if (o1) {
              o1.nextWorkCentreIMachine = newCell;
              o1.priority = newPriority;
            }
          } else {
            updateJobPriority(o.job as string, (o.priority as number) + 1);
            let o1 = trolleyStorageOpsCopy1.find((x) => x.job === o.job);
            if (o1) o1.priority = (o.priority as number) + 1;
          }
        });
        trolleyStorageOpsCopy1.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        setTrolleyStorageOps(trolleyStorageOpsCopy1);
      }
    }
    // If last
    else if (
      result.destination &&
      result.destination.index === trolleyStorageOpsCopy.length - 1
    ) {
      let behindJob = trolleyStorageOpsCopy[trolleyStorageOpsCopy.length - 2];
      if (op && op.job && behindJob) {
        const newPriority = (behindJob.priority as number) + 1;
        updateJobPriority(op.job, newPriority);
        updateJobCell(op.job, newCell);
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );
        let o = trolleyStorageOpsCopy1.find((x) => x.job === op?.job);
        if (o) {
          o.priority = newPriority;
          o.nextWorkCentreIMachine = newCell;
          trolleyStorageOpsCopy1.sort(
            (a, b) => (a.priority as number) - (b.priority as number)
          );
          setTrolleyStorageOps(trolleyStorageOpsCopy1);
        }
      }
    }
    // If in between
    else if (result.destination) {
      let behindJob = trolleyStorageOpsCopy[result.destination.index - 1];
      if (behindJob) {
        const newPriority = (behindJob.priority as number) + 1;
        let trolleyStorageOpsCopy1: WipCurrentOp[] = JSON.parse(
          JSON.stringify(trolleyStorageOps)
        );

        trolleyStorageOpsCopy.forEach((o, index) => {
          if (o.job === result.draggableId) {
            updateJobCell(o.job, newCell);
            updateJobPriority(o.job, newPriority);
            let o1 = trolleyStorageOpsCopy1.find((x) => x.job === o.job);
            if (o1) {
              o1.nextWorkCentreIMachine = newCell;
              o1.priority = newPriority;
            }
          } else if (result.destination && index >= result.destination?.index) {
            updateJobPriority(o.job as string, (o.priority as number) + 1);
            let o1 = trolleyStorageOpsCopy1.find((x) => x.job === o.job);
            if (o1) o1.priority = (o.priority as number) + 1;
          }
        });

        trolleyStorageOpsCopy1.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        setTrolleyStorageOps(trolleyStorageOpsCopy1);
      }
    }
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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {cells.map((cell) => {
          return (
            <Grid
              item
              xs={3}
              key={cell.name}
              height="50%"
              sx={{
                borderTop:
                  cells.indexOf(cell) >= 4
                    ? `0.5px solid ${theme.palette.divider}`
                    : null,
                borderRight:
                  cells.indexOf(cell) === 3 || cells.indexOf(cell) === 7
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
                      colSpan={6}
                      sx={{ borderBottom: "none" }}
                    >
                      <Stack direction="row">
                        <Chip
                          label={getRowCount(cell)}
                          variant="outlined"
                          sx={{ mr: 2, fontWeight: "bold" }}
                          size="small"
                        />
                        <Typography fontSize={16} fontWeight="bold">
                          {cell.name}
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
                          onClick={() => handleSetFullScreenTable(cell)}
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
                      <DefaultTableCell>Next Op</DefaultTableCell>
                    </TableRow>
                  </TableHead>
                  {cell.name !== "Other" ? (
                    <CellTableBody
                      cell={cell.name}
                      assemblyOps={assemblyOps as WipCurrentOp[]}
                      trolleyStorageOps={trolleyStorageOps as WipCurrentOp[]}
                      handleOnJobSelection={handleOnJobSelection}
                    />
                  ) : (
                    <OtherTableBody
                      assemblyOps={assemblyOps as WipCurrentOp[]}
                      handleOnJobSelection={handleOnJobSelection}
                    />
                  )}
                </Table>
              </TableContainer>
            </Grid>
          );
        })}
      </DragDropContext>
      <FullScreenAssemblyCellDialog
        handleDialogClose={handleFullScreenDialogClose}
        table={selectedTable}
        ops={selectedTableOps}
        setOps={setSelectedTableOps}
      />
      <AllOperationsDialog
        handleDialogClose={handleDialogClose}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        allOperations={selectedJobAllOperations}
        setAllOperations={setSelectedJobAllOperations}
      />
    </Grid>
  );
}

export default AssemblyDashboardView;
