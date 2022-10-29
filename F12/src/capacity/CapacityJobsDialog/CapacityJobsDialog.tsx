import { Clear } from "@mui/icons-material";
import {
  Chip,
  Dialog,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import { updateJobCell, updateJobPriority } from "capacity/fetch";
import { CapacityJob } from "capacity/models";
import AmberTableRow from "core/AmberTableRow";
import DefaultTableCell from "core/DefaultTableCell";
import GreenTableRow from "core/GreenTableRow";
import RedTableRow from "core/RedTableRow";
import NumericInput, { HTMLNumericElement } from "material-ui-numeric-input";
import { ChangeEvent, SetStateAction, useLayoutEffect, useState } from "react";
import { Cells } from "core/consts";

interface CapacityJobsDialogProps {
  handleDialogClose: () => void;
  title: string | undefined;
  jobs: CapacityJob[] | undefined;
  setJobs: (value: SetStateAction<CapacityJob[] | undefined>) => void;
}

function CapacityJobsDialog(props: CapacityJobsDialogProps) {
  const { handleDialogClose, title, jobs, setJobs } = props;
  const theme = useTheme();

  const [moved, setMoved] = useState<string[]>([]);

  useLayoutEffect(() => setMoved([]), [jobs]);

  function handlePriorityChange(
    event: ChangeEvent<HTMLNumericElement>,
    job: CapacityJob
  ) {
    let val = event.target.value;
    let num = Number(val);

    if (num && num > 0) {
      updateJobPriority(job.job, num);
      setTimeout(() => {
        let allJobsCopy: CapacityJob[] = JSON.parse(JSON.stringify(jobs));
        let jobCopy = allJobsCopy.find((o) => o.job === job.job);
        if (jobCopy) jobCopy.priority = num;
        allJobsCopy.sort(
          (a, b) => (a.priority as number) - (b.priority as number)
        );
        setJobs(allJobsCopy);
      }, 1000);
    }
  }

  function handleCellChange(
    event: SelectChangeEvent<string>,
    job: CapacityJob
  ) {
    let newCell = event.target.value;
    if (job.cell !== newCell) {
      updateJobCell(job.job, newCell);
      let allJobsCopy: CapacityJob[] = JSON.parse(JSON.stringify(jobs));
      allJobsCopy = allJobsCopy.filter((o) => o.job !== job.job);
      setJobs(allJobsCopy);
    }
  }

  return (
    <Dialog
      onClose={handleDialogClose}
      open={Boolean(title)}
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
                  label={jobs?.length}
                  variant="outlined"
                  sx={{ mr: 2, fontWeight: "bold" }}
                  size="small"
                />
                <Typography fontSize={16} fontWeight="bold">
                  {title}
                </Typography>
              </Stack>
            </TableCell>
            <TableCell align="right" colSpan={1} sx={{ borderBottom: "none" }}>
              <Tooltip title="Close" disableInteractive>
                <IconButton onClick={handleDialogClose}>
                  <Clear
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
              <DefaultTableCell>Hours</DefaultTableCell>
              <DefaultTableCell>Cell</DefaultTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs
              ?.sort((a, b) => a.priority - b.priority)
              .filter((x) => !moved.includes(x.job))
              .map((job) => {
                if (job.priority <= 29) {
                  return (
                    <RedTableRow key={job.capacityJobId}>
                      <DefaultTableCell component="th" scope="row">
                        {job.job?.replace("000000000", "")}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.stockCode}</DefaultTableCell>
                      <DefaultTableCell>
                        {job.stockDescription}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.qty}</DefaultTableCell>
                      <DefaultTableCell>
                        <NumericInput
                          defaultValue={job.priority}
                          onChange={(event) => handlePriorityChange(event, job)}
                          precision={0}
                          thousandChar={","}
                          decimalChar={"."}
                          sx={{
                            maxWidth: "75px",
                          }}
                        />
                      </DefaultTableCell>
                      <DefaultTableCell>
                        {(job.priority as number) <= 19 ? "Sales" : "Stock"}
                      </DefaultTableCell>{" "}
                      <DefaultTableCell>
                        {job.timeUsed.toFixed(2)}
                      </DefaultTableCell>
                      <DefaultTableCell>
                        <Select
                          value={job.cell}
                          onChange={(event) => handleCellChange(event, job)}
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
                    </RedTableRow>
                  );
                } else if (job.priority >= 30 && job.priority <= 49) {
                  return (
                    <AmberTableRow key={job.capacityJobId}>
                      <DefaultTableCell component="th" scope="row">
                        {job.job?.replace("000000000", "")}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.stockCode}</DefaultTableCell>
                      <DefaultTableCell>
                        {job.stockDescription}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.qty}</DefaultTableCell>
                      <DefaultTableCell>
                        <NumericInput
                          defaultValue={job.priority}
                          onChange={(event) => handlePriorityChange(event, job)}
                          precision={0}
                          thousandChar={","}
                          decimalChar={"."}
                          sx={{
                            maxWidth: "75px",
                          }}
                        />
                      </DefaultTableCell>
                      <DefaultTableCell>
                        {(job.priority as number) <= 19 ? "Sales" : "Stock"}
                      </DefaultTableCell>
                      <DefaultTableCell>
                        {job.timeUsed.toFixed(2)}
                      </DefaultTableCell>
                      <DefaultTableCell>
                        <Select
                          value={job.cell}
                          onChange={(event) => handleCellChange(event, job)}
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
                    </AmberTableRow>
                  );
                } else {
                  return (
                    <GreenTableRow key={job.capacityJobId}>
                      <DefaultTableCell component="th" scope="row">
                        {job.job?.replace("000000000", "")}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.stockCode}</DefaultTableCell>
                      <DefaultTableCell>
                        {job.stockDescription}
                      </DefaultTableCell>
                      <DefaultTableCell>{job.qty}</DefaultTableCell>
                      <DefaultTableCell>
                        <NumericInput
                          defaultValue={job.priority}
                          onChange={(event) => handlePriorityChange(event, job)}
                          precision={0}
                          thousandChar={","}
                          decimalChar={"."}
                          sx={{
                            maxWidth: "75px",
                          }}
                        />
                      </DefaultTableCell>
                      <DefaultTableCell>
                        {(job.priority as number) <= 19 ? "Sales" : "Stock"}
                      </DefaultTableCell>
                      <DefaultTableCell>
                        {job.timeUsed.toFixed(2)}
                      </DefaultTableCell>
                      <DefaultTableCell>
                        <Select
                          value={job.cell}
                          onChange={(event) => handleCellChange(event, job)}
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
                    </GreenTableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
}

export default CapacityJobsDialog;
