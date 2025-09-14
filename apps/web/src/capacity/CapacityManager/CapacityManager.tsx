import {
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  fetchCellCapacityDays,
  fetchAllCapacityDays,
  shiftCapacityJob,
} from "capacity/fetch";
import { CapacityDay, CapacityJob } from "capacity/models";
import { useContext, useLayoutEffect, useState } from "react";
import { format } from "date-fns";
import DefaultTableCell from "core/DefaultTableCell";
import CapacityTableRow from "capacity/CapacityTableRow";
import CapacityTableCell from "capacity/CapacityTableCell";
import CapacityDaysDialog from "capacity/CapacityDaysDialog";
import { useInterval, useLocalStorage } from "usehooks-ts";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  CalendarMonthRounded,
  DateRangeRounded,
  InsertInvitationRounded,
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
  MoreTimeRounded,
} from "@mui/icons-material";
import CapacityJobsDialog from "capacity/CapacityJobsDialog";
import CapacityJobRow from "capacity/CapacityJobRow";
import CapacityHoursRow from "capacity/CapacityHoursRow/CapacityHoursRow";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfToday,
  addWeeks,
  startOfDay,
} from "date-fns";
import CapacityLostHoursDialog from "capacity/CapacityLostHoursDialog";
import { CoreContext } from "core/context";
import DefaultOutlinedButton from "core/DefaultOutlinedButton";
import { Cells } from "core/consts";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";

function CapacityManager() {
  const theme = useTheme();
  const { loggedIn } = useContext(CoreContext);

  const [view, setView] = useLocalStorage<"Week" | "Month" | "Range">(
    "F12_CAPACITY_VIEW",
    "Week"
  );
  const [fromDate, setFromDate] = useState(new Date(startOfToday()));
  const [toDate, setToDate] = useState(new Date());
  const [lostHoursMonth, setLostHoursMonth] = useState<Date | undefined>();

  const [cell1CapacityDays, setCell1CapacityDays] = useState<CapacityDay[]>([]);
  const [cell2CapacityDays, setCell2CapacityDays] = useState<CapacityDay[]>([]);
  const [cell3CapacityDays, setCell3CapacityDays] = useState<CapacityDay[]>([]);
  const [cell4CapacityDays, setCell4CapacityDays] = useState<CapacityDay[]>([]);
  const [cell5CapacityDays, setCell5CapacityDays] = useState<CapacityDay[]>([]);
  const [cell6CapacityDays, setCell6CapacityDays] = useState<CapacityDay[]>([]);
  const [cell7CapacityDays, setCell7CapacityDays] = useState<CapacityDay[]>([]);
  const [selectedCapacityDay, setSelectedCapacityDay] = useState<CapacityDay>();
  const [selectedTitle, setSelectedTitle] = useState<string>();
  const [selectedCapacityJobs, setSelectedCapacityJobs] =
    useState<CapacityJob[]>();

  useLayoutEffect(() => {
    updateDates();
  }, [view]);

  useLayoutEffect(() => {
    quickFetch();
  }, [fromDate, toDate]);

  useInterval(() => bulkFetch(), 30000);

  // Fetch each cell individually as quicker
  function quickFetch() {
    fetchCellCapacityDays("CELL01", fromDate, toDate).then((data) => {
      setCell1CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL02", fromDate, toDate).then((data) => {
      setCell2CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL03", fromDate, toDate).then((data) => {
      setCell3CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL04", fromDate, toDate).then((data) => {
      setCell4CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL05", fromDate, toDate).then((data) => {
      setCell5CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL06", fromDate, toDate).then((data) => {
      setCell6CapacityDays(data as CapacityDay[]);
    });
    fetchCellCapacityDays("CELL07", fromDate, toDate).then((data) => {
      setCell7CapacityDays(data as CapacityDay[]);
    });
  }

  // Bulk fetch to update as slower but less requests
  function bulkFetch() {
    fetchAllCapacityDays(fromDate, toDate).then((data) => {
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          switch (key) {
            default:
              setCell1CapacityDays(value as CapacityDay[]);
              break;
            case "CELL02":
              setCell2CapacityDays(value as CapacityDay[]);
              break;
            case "CELL03":
              setCell3CapacityDays(value as CapacityDay[]);
              break;
            case "CELL04":
              setCell4CapacityDays(value as CapacityDay[]);
              break;
            case "CELL05":
              setCell5CapacityDays(value as CapacityDay[]);
              break;
            case "CELL06":
              setCell6CapacityDays(value as CapacityDay[]);
              break;
            case "CELL07":
              setCell7CapacityDays(value as CapacityDay[]);
              break;
          }
        }
      }
    });
  }

  function updateDates() {
    let today = new Date();
    if (view === "Week") {
      handleSetFromDate(startOfWeek(today));
      handleSetToDate(endOfWeek(today));
    } else if (view === "Month") {
      handleSetFromDate(startOfMonth(today));
      handleSetToDate(endOfMonth(today));
    } else {
      handleSetFromDate(startOfToday());
      handleSetToDate(startOfDay(addWeeks(today, 4)));
    }
  }

  function handleSetPreviousDate() {
    if (view === "Month") {
      let newFromDate = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth() - 1,
        1
      );
      handleSetFromDate(newFromDate);
      handleSetToDate(endOfMonth(newFromDate));
    } else {
      let newFromDate = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate() - 7
      );
      handleSetFromDate(newFromDate);
      handleSetToDate(endOfWeek(newFromDate));
    }
  }

  function handleSetNextDate() {
    if (view === "Month") {
      let newFromDate = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth() + 1,
        1
      );
      handleSetFromDate(newFromDate);
      handleSetToDate(endOfMonth(newFromDate));
    } else {
      let newFromDate = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate() + 7
      );
      handleSetFromDate(newFromDate);
      handleSetToDate(endOfWeek(newFromDate));
    }
  }

  function getTotalHoursAvailable() {
    let total = 0;
    Cells.forEach((cell) => {
      total += getCellHoursAvailable(cell);
    });
    return total;
  }

  function getCellHoursAvailable(cell: string) {
    let total = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (cell) {
      default:
        cell1CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL02":
        cell2CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL03":
        cell3CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL04":
        cell4CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL05":
        cell5CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL06":
        cell6CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
      case "CELL07":
        cell7CapacityDays.forEach((capacityDay) => {
          let day = new Date(capacityDay.day.toString());
          if (day >= today) {
            total += capacityDay.availableHours - capacityDay.hoursUsed;
          }
        });
        break;
    }

    return total;
  }

  function handleSetView(view: "Month" | "Week" | "Range") {
    setView(view);
  }

  function handleSetFromDate(date: Date) {
    setFromDate(date);
  }

  function handleSetToDate(date: Date) {
    setToDate(date);
  }

  function selectCapacityDay(capacityDay: CapacityDay) {
    setSelectedCapacityDay(capacityDay);
  }

  function handleCapacityDaysDialogClose() {
    setSelectedCapacityDay(undefined);
    bulkFetch();
  }

  function handleCapacityJobsDialogClose() {
    setSelectedTitle(undefined);
    setSelectedCapacityJobs(undefined);
    bulkFetch();
  }

  function handleCapacityJobOnClick(job: CapacityJob) {
    let day = "";
    let jobs: CapacityJob[] = [];
    switch (job.cell) {
      default:
        cell1CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL02":
        cell2CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL03":
        cell3CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL04":
        cell4CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL05":
        cell5CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL06":
        cell6CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
      case "CELL07":
        cell7CapacityDays.forEach((x) => {
          if (x.capacityDayId === job.capacityDayId) {
            day = format(Date.parse(x.day.toString()), "dd/MM/yy");
            if (x.capacityJobs) {
              x.capacityJobs.forEach((y) => {
                jobs.push(y);
              });
            }
          }
        });
        break;
    }

    setSelectedTitle(job.cell + " - " + day);
    setSelectedCapacityJobs(jobs);
  }

  function handleSetLostHoursMonth() {
    setLostHoursMonth(fromDate);
  }

  function handleCloseLostHoursDialog() {
    setLostHoursMonth(undefined);
  }

  async function handleOnDragEnd(result: DropResult) {
    if (result.destination && result.destination.droppableId) {
      shiftCapacityJob(
        result.draggableId,
        result.destination.droppableId,
        result.destination.index
      ).then(() => bulkFetch());
    }
  }

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        minWidth: "100vw",
      }}
    >
      <Grid
        item
        xs={12}
        height="10%"
        sx={{
          m: 5,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              height: "48px",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={fromDate}
                views={
                  view === "Month"
                    ? ["year", "month"]
                    : ["year", "month", "day"]
                }
                openTo="month"
                onChange={(newValue) => {
                  let newDate = newValue as Date;
                  if (view === "Week") {
                    handleSetFromDate(startOfWeek(newDate));
                    handleSetToDate(endOfWeek(newDate));
                  } else if (view === "Month") {
                    handleSetFromDate(startOfMonth(newDate));
                    handleSetToDate(endOfMonth(newDate));
                  } else {
                    handleSetFromDate(newDate);
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {view === "Range" && (
              <>
                <Typography
                  variant="h2"
                  component="div"
                  fontSize={18}
                  fontWeight="400"
                  color={theme.palette.text.primary}
                >
                  to
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={toDate}
                    views={["year", "month", "day"]}
                    openTo="month"
                    onChange={(newValue) => {
                      handleSetToDate(newValue as Date);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </>
            )}
            {view !== "Range" && (
              <>
                <Tooltip title={`Previous ${view}`} disableInteractive>
                  <IconButton onClick={handleSetPreviousDate}>
                    <KeyboardArrowLeftRounded fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Next ${view}`} disableInteractive>
                  <IconButton onClick={handleSetNextDate}>
                    <KeyboardArrowRightRounded fontSize="large" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {view === "Month" && loggedIn && (
              <DefaultOutlinedButton
                variant="outlined"
                startIcon={
                  <MoreTimeRounded
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  />
                }
                onClick={handleSetLostHoursMonth}
              >
                Lost Hours
              </DefaultOutlinedButton>
            )}
            <ToggleButtonGroup value={view} exclusive>
              <ToggleButton value="Week" onClick={() => handleSetView("Week")}>
                <Tooltip title="Week View" disableInteractive>
                  <DateRangeRounded />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="Range"
                onClick={() => handleSetView("Range")}
              >
                <Tooltip title="Range View" disableInteractive>
                  <InsertInvitationRounded />
                </Tooltip>
              </ToggleButton>
              <ToggleButton
                value="Month"
                onClick={() => handleSetView("Month")}
              >
                <Tooltip title="Month View" disableInteractive>
                  <CalendarMonthRounded />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        height="90%"
        sx={{
          mx: 5,
        }}
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundImage: "none",
              height: "fill-available",
              overflow: "initial",
            }}
            variant="outlined"
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <DefaultTableCell
                    sx={{
                      borderRight: `0.5px solid rgba(255, 255, 255, 0.25)`,
                    }}
                  >
                    <Stack alignItems="center" minWidth="125px">
                      <Box>
                        <strong>Total Available</strong>
                      </Box>
                      <Box>{getTotalHoursAvailable().toFixed(2)}</Box>
                    </Stack>
                  </DefaultTableCell>
                  {cell1CapacityDays.map((capacityDay) => {
                    return (
                      <DefaultTableCell
                        key={capacityDay.day.toString()}
                        sx={{
                          borderRight: `0.5px solid rgba(255, 255, 255, 0.25)`,
                        }}
                      >
                        {format(
                          Date.parse(capacityDay.day.toString()),
                          "EEEEE dd/MM"
                        )}
                      </DefaultTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                <CapacityHoursRow
                  capacityDays={cell1CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL01</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL01").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell1CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell2CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL02</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL02").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell2CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell3CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL03</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL03").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell3CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell4CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL04</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL04").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell4CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell5CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL05</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL05").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell5CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell6CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL06</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL06").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell6CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
                <CapacityHoursRow
                  capacityDays={cell7CapacityDays}
                  selectCapacityDay={selectCapacityDay}
                />
                <CapacityTableRow>
                  <CapacityTableCell component="th" scope="row">
                    <Stack alignItems="center">
                      <Box>
                        <strong>CELL07</strong>
                      </Box>
                      <Box>{getCellHoursAvailable("CELL07").toFixed(2)}</Box>
                    </Stack>
                  </CapacityTableCell>
                  {cell7CapacityDays.map((capacityDay) => {
                    return loggedIn ? (
                      <Droppable
                        droppableId={capacityDay.capacityDayId}
                        type="DAY"
                      >
                        {(provided) => (
                          <CapacityTableCell
                            key={capacityDay.capacityDayId}
                            sx={{
                              padding: 0,
                              justifyContent: "start",
                            }}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <Stack
                              direction="column"
                              spacing={0.5}
                              justifyContent="start"
                            >
                              {capacityDay.capacityJobs &&
                                capacityDay.capacityJobs
                                  .sort((a, b) => a.priority - b.priority)
                                  .map((capacityJob, index) => {
                                    return (
                                      <CapacityJobRow
                                        key={capacityJob.capacityJobId}
                                        capacityJob={capacityJob}
                                        onClick={handleCapacityJobOnClick}
                                        index={index}
                                      />
                                    );
                                  })}
                            </Stack>
                          </CapacityTableCell>
                        )}
                      </Droppable>
                    ) : (
                      <CapacityTableCell
                        key={capacityDay.capacityDayId}
                        sx={{
                          padding: 0,
                          justifyContent: "start",
                        }}
                      >
                        <Stack
                          direction="column"
                          spacing={0.5}
                          justifyContent="start"
                        >
                          {capacityDay.capacityJobs &&
                            capacityDay.capacityJobs
                              .sort((a, b) => a.priority - b.priority)
                              .map((capacityJob, index) => {
                                return (
                                  <CapacityJobRow
                                    key={capacityJob.capacityJobId}
                                    capacityJob={capacityJob}
                                    onClick={handleCapacityJobOnClick}
                                    index={index}
                                  />
                                );
                              })}
                        </Stack>
                      </CapacityTableCell>
                    );
                  })}
                </CapacityTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DragDropContext>
        {loggedIn && (
          <>
            <CapacityDaysDialog
              capacityDay={selectedCapacityDay}
              handleClose={handleCapacityDaysDialogClose}
            />
            <CapacityJobsDialog
              title={selectedTitle}
              jobs={selectedCapacityJobs}
              setJobs={setSelectedCapacityJobs}
              handleDialogClose={handleCapacityJobsDialogClose}
            />
            <CapacityLostHoursDialog
              month={lostHoursMonth}
              handleClose={handleCloseLostHoursDialog}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default CapacityManager;
