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
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { WipJobAllLab } from "core/models";
import { DashboardTable, WipCurrentOp } from "operations/models";
import { getLastColumnName } from "operations/OperationsDashboardView/OperationsDashboardView";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import GreenTableRow from "core/GreenTableRow";
import AllOperationsDialog from "operations/AllOperationsDialog";
import { ChangeEvent, SetStateAction, useContext, useState } from "react";
import {
  fetchJobAllOps,
  updateJobCell,
  updateJobPriority,
} from "operations/fetch";
import NumericInput, { HTMLNumericElement } from "material-ui-numeric-input";
import { CoreContext } from "core/context";
import { Cells } from "core/consts";

interface FullScreenAssemblyCellDialogProps {
  handleDialogClose: () => void;
  table: DashboardTable | undefined;
  ops: WipCurrentOp[] | undefined;
  setOps: (value: SetStateAction<WipCurrentOp[] | undefined>) => void;
}

function FullScreenAssemblyCellDialog(
  props: FullScreenAssemblyCellDialogProps
) {
  const { handleDialogClose, table, ops, setOps } = props;
  const { loggedIn } = useContext(CoreContext);
  const theme = useTheme();

  const [selectedJob, setSelectedJob] = useState<WipCurrentOp>();
  const [selectedJobAllOperations, setSelectedJobAllOperations] =
    useState<WipJobAllLab[]>();

  function handleAllOpsDialogClose() {
    setSelectedJob(undefined);
    setTimeout(() => setSelectedJobAllOperations(undefined), 500);
  }

  function handleOnJobSelection(op: WipCurrentOp) {
    fetchJobAllOps(op).then((data) => {
      setSelectedJob(op);
      setSelectedJobAllOperations(data);
    });
  }

  function handlePriorityChange(
    event: ChangeEvent<HTMLNumericElement>,
    op: WipCurrentOp
  ) {
    let val = event.target.value;
    let num = Number(val);

    if (num && num > 0) {
      updateJobPriority(op.job as string, num);
      setTimeout(() => {
        let allOpsCopy: WipCurrentOp[] = JSON.parse(JSON.stringify(ops));
        let assemblyOp = allOpsCopy.find((o) => o.workCentre === "ASSY01");
        allOpsCopy = allOpsCopy.filter((op) => op.workCentre !== "ASSY01");
        let opCopy = allOpsCopy.find((o) => o.job === op.job);
        if (opCopy) opCopy.priority = num;
        allOpsCopy.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        if (assemblyOp) allOpsCopy.unshift(assemblyOp);
        setOps(allOpsCopy);
      }, 1000);
    }
  }

  function handleCellChange(
    event: SelectChangeEvent<string>,
    op: WipCurrentOp
  ) {
    let newCell = event.target.value;
    if (op.workCentre === "ASSY01" && op.iMachine !== newCell) {
      updateJobCell(op.job as string, newCell);
      let allOpsCopy: WipCurrentOp[] = JSON.parse(JSON.stringify(ops));
      allOpsCopy = allOpsCopy.filter((o) => o.job !== op.job);
      setOps(allOpsCopy);
    } else {
      updateJobCell(op.job as string, newCell);
      let allOpsCopy: WipCurrentOp[] = JSON.parse(JSON.stringify(ops));
      allOpsCopy = allOpsCopy.filter((o) => o.job !== op.job);
      setOps(allOpsCopy);
    }
  }

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
            <TableCell align="left" colSpan={6} sx={{ borderBottom: "none" }}>
              <Stack direction="row">
                <Chip
                  label={ops?.length}
                  variant="outlined"
                  sx={{ mr: 2, fontWeight: "bold" }}
                  size="small"
                />
                <Typography fontSize={16} fontWeight="bold">
                  {table?.name}
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
              <DefaultTableCell>Job</DefaultTableCell>
              <DefaultTableCell>Code</DefaultTableCell>
              <DefaultTableCell>Description</DefaultTableCell>
              <DefaultTableCell>Qty</DefaultTableCell>
              <DefaultTableCell>Priority</DefaultTableCell>
              <DefaultTableCell>Purpose</DefaultTableCell>
              <DefaultTableCell>
                {getLastColumnName(table?.name as string)}
              </DefaultTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ops?.map((op, index) => {
              return table?.name === op.workCentre ||
                table?.name === op.iMachine ? (
                <GreenTableRow
                  key={op.job}
                  onClick={() => handleOnJobSelection(op)}
                >
                  <DefaultTableCell component="th" scope="row">
                    {op.job?.replace("000000000", "")}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                  <DefaultTableCell>
                    {table?.name === "Goods Returned for Repair"
                      ? op.jobDescription
                      : op.stockDescription}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                  {loggedIn ? (
                    <DefaultTableCell onClick={(e) => e.stopPropagation()}>
                      <NumericInput
                        defaultValue={op.priority}
                        onChange={(event) => handlePriorityChange(event, op)}
                        precision={0}
                        thousandChar={","}
                        decimalChar={"."}
                        sx={{
                          maxWidth: "75px",
                        }}
                        disabled={!loggedIn}
                      />
                    </DefaultTableCell>
                  ) : (
                    <DefaultTableCell>{op.priority}</DefaultTableCell>
                  )}
                  <DefaultTableCell>
                    {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.nextWorkCentre}</DefaultTableCell>
                </GreenTableRow>
              ) : (
                <DefaultTableRow
                  key={op.job}
                  onClick={() => handleOnJobSelection(op)}
                >
                  <DefaultTableCell component="th" scope="row">
                    {op.job?.replace("000000000", "")}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                  <DefaultTableCell>
                    {table?.name === "Goods Returned for Repair"
                      ? op.jobDescription
                      : op.stockDescription}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                  {loggedIn ? (
                    <DefaultTableCell onClick={(e) => e.stopPropagation()}>
                      <NumericInput
                        defaultValue={op.priority}
                        onChange={(event) => handlePriorityChange(event, op)}
                        precision={0}
                        thousandChar={","}
                        decimalChar={"."}
                        sx={{
                          maxWidth: "75px",
                        }}
                        disabled={!loggedIn}
                      />
                    </DefaultTableCell>
                  ) : (
                    <DefaultTableCell>{op.priority}</DefaultTableCell>
                  )}
                  <DefaultTableCell>
                    {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                  </DefaultTableCell>
                  {loggedIn ? (
                    <DefaultTableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={
                          table?.name === "Assembly Cells"
                            ? op.iMachine
                            : op.nextWorkCentreIMachine
                        }
                        onChange={(event) => handleCellChange(event, op)}
                      >
                        {Cells.map((cell) => {
                          return (
                            <MenuItem key={cell} value={cell}>
                              {cell}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </DefaultTableCell>
                  ) : (
                    <DefaultTableCell>
                      {op.nextWorkCentreIMachine}
                    </DefaultTableCell>
                  )}
                </DefaultTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <AllOperationsDialog
        handleDialogClose={handleAllOpsDialogClose}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        allOperations={selectedJobAllOperations}
        setAllOperations={setSelectedJobAllOperations}
      />
    </Dialog>
  );
}

export default FullScreenAssemblyCellDialog;
