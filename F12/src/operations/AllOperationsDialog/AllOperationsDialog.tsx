import { CloseRounded } from "@mui/icons-material";
import {
  Dialog,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  IconButton,
  TableCell,
  Tooltip,
  Chip,
  Stack,
  useTheme,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Cells } from "core/consts";
import { CoreContext } from "core/context";
import { updateJobCell, updateJobPriority } from "operations/fetch";
import { WipCurrentOp } from "operations/models";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import GreenTableRow from "core/GreenTableRow";
import { format } from "date-fns";
import NumericInput, { HTMLNumericElement } from "material-ui-numeric-input";
import { ChangeEvent, SetStateAction, useContext } from "react";
import { WipJobAllLab } from "core/models";

interface AllOperationsDialogProps {
  handleDialogClose: () => void;
  selectedJob: WipCurrentOp | undefined;
  setSelectedJob: (value: SetStateAction<WipCurrentOp | undefined>) => void;
  allOperations: WipJobAllLab[] | undefined;
  setAllOperations: (value: SetStateAction<WipJobAllLab[] | undefined>) => void;
}

function AllOperationsDialog(props: AllOperationsDialogProps) {
  const {
    handleDialogClose,
    selectedJob,
    setSelectedJob,
    allOperations,
    setAllOperations,
  } = props;
  const theme = useTheme();
  const { loggedIn } = useContext(CoreContext);

  function handleCellChange(
    event: SelectChangeEvent<string>,
    op: WipJobAllLab
  ) {
    let newCell = event.target.value;
    if (op.iMachine !== newCell) {
      updateJobCell(op.job as string, newCell);
      let copy: WipJobAllLab[] = JSON.parse(JSON.stringify(allOperations));
      let o = copy.find((x) => x.operation === op.operation);
      if (o) {
        o.iMachine = newCell;
        setAllOperations(copy);
      }
    }
  }

  function handlePriorityChange(event: ChangeEvent<HTMLNumericElement>) {
    let val = event.target.value;
    let num = Number(val);
    if (num && num > 0) {
      updateJobPriority(selectedJob?.job as string, num);
      let copy: WipCurrentOp = JSON.parse(JSON.stringify(selectedJob));
      copy.priority = num;
      setSelectedJob(copy);
    } else {
      return;
    }
  }

  function getIMachine() {
    let op = allOperations?.find((x) => x.iMachine !== " ");
    return op?.iMachine;
  }

  return (
    <Dialog
      onClose={handleDialogClose}
      open={Boolean(selectedJob)}
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
                  label={allOperations?.length}
                  variant="outlined"
                  sx={{ mr: 2, fontWeight: "bold" }}
                  size="small"
                />
                <Typography
                  fontSize={16}
                  fontWeight="bold"
                  sx={{ borderBottom: "none" }}
                >
                  All Operations
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="right" colSpan={1} sx={{ borderBottom: "none" }}>
              <Tooltip title="Close" disableInteractive>
                <IconButton onClick={handleDialogClose}>
                  <CloseRounded
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
              <DefaultTableCell>Operation</DefaultTableCell>
              <DefaultTableCell>Work Centre</DefaultTableCell>
              <DefaultTableCell>Work Centre Description</DefaultTableCell>
              <DefaultTableCell>Planned End Date</DefaultTableCell>
              <DefaultTableCell>Priority</DefaultTableCell>
              <DefaultTableCell>Cell</DefaultTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOperations?.map((op) => {
              return selectedJob?.lowestOP === op.operation ? (
                <GreenTableRow key={op.operation}>
                  <DefaultTableCell component="th" scope="row">
                    {op.job?.replace("000000000", "")}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.operation}</DefaultTableCell>
                  <DefaultTableCell>{op.workCentre}</DefaultTableCell>
                  <DefaultTableCell>{op.workCentreDesc}</DefaultTableCell>
                  <DefaultTableCell>
                    {op.plannedEndDate &&
                      format(
                        Date.parse(op.plannedEndDate.toString()),
                        "dd/MM/yy"
                      )}
                  </DefaultTableCell>
                  {loggedIn ? (
                    <DefaultTableCell onClick={(e) => e.stopPropagation()}>
                      <NumericInput
                        defaultValue={selectedJob?.priority}
                        onChange={(event) => handlePriorityChange(event)}
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
                    <DefaultTableCell>{selectedJob?.priority}</DefaultTableCell>
                  )}
                  {loggedIn ? (
                    <DefaultTableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={getIMachine()}
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
                    <DefaultTableCell>{getIMachine()}</DefaultTableCell>
                  )}
                </GreenTableRow>
              ) : (
                <DefaultTableRow key={op.operation}>
                  <DefaultTableCell component="th" scope="row">
                    {op.job?.replace("000000000", "")}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.operation}</DefaultTableCell>
                  <DefaultTableCell>{op.workCentre}</DefaultTableCell>
                  <DefaultTableCell>{op.workCentreDesc}</DefaultTableCell>
                  <DefaultTableCell>
                    {op.plannedEndDate &&
                      format(
                        Date.parse(op.plannedEndDate.toString()),
                        "dd/MM/yy"
                      )}
                  </DefaultTableCell>
                  <DefaultTableCell />
                  <DefaultTableCell />
                </DefaultTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}

export default AllOperationsDialog;
