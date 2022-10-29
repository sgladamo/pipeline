import { Grid, Typography, useTheme } from "@mui/material";
import { endOfMonth, startOfMonth, startOfYear, format } from "date-fns";
import { useLayoutEffect, useState } from "react";
import { getForecastItems, getTotalItems } from "operations/fetch";
import KPIPercentageCard from "operations/KPIPercentageCard";

function OperationsKPIView() {
  return <OperationsKPIPercentageCards />;
}

export default OperationsKPIView;

function OperationsKPIPercentageCards() {
  const theme = useTheme();

  const [today] = useState(new Date());
  const [todayLastYear] = useState(
    new Date(new Date().setFullYear(today.getFullYear() - 1))
  );

  const [monthItems, setMonthItems] = useState(0);
  const [forecastMonthItems, setForecastMonthItems] = useState(0);
  const [monthMachines, setMonthMachines] = useState(0);
  const [forecastMonthMachines, setForecastMonthMachines] = useState(0);
  const [monthTools, setMonthTools] = useState(0);
  const [forecastMonthTools, setForecastMonthTools] = useState(0);
  const [monthCS, setMonthCS] = useState(0);
  const [forecastMonthCS, setForecastMonthCS] = useState(0);

  const [ytdItems, setYTDItems] = useState(0);
  const [previousYTDItems, setPreviousYTDItems] = useState(0);
  const [ytdMachines, setYTDMachines] = useState(0);
  const [previousYTDMachines, setPreviousYTDMachines] = useState(0);
  const [ytdTools, setYTDTools] = useState(0);
  const [previousYTDTools, setPreviousYTDTools] = useState(0);
  const [ytdCS, setYTDCS] = useState(0);
  const [previousYTDCS, setPreviousYTDCS] = useState(0);

  useLayoutEffect(() => {
    getTotalItems("ASSY01", startOfMonth(today), today, null).then((data) =>
      setMonthItems(data as number)
    );
    getForecastItems(endOfMonth(today), null).then((data) => {
      setForecastMonthItems(data as number);
    });
    getTotalItems("ASSY01", startOfMonth(today), today, "Machines").then(
      (data) => setMonthMachines(data as number)
    );
    getForecastItems(endOfMonth(today), "Machines").then((data) => {
      setForecastMonthMachines(data as number);
    });
    getTotalItems("ASSY01", startOfMonth(today), today, "Tools").then((data) =>
      setMonthTools(data as number)
    );
    getForecastItems(endOfMonth(today), "Tools").then((data) => {
      setForecastMonthTools(data as number);
    });
    getTotalItems("ASSY01", startOfMonth(today), today, "Consumables").then(
      (data) => {
        getTotalItems("ASSY01", startOfMonth(today), today, "Spares").then(
          (data1) => {
            let total = (data as number) + (data1 as number);
            setMonthCS(total);
          }
        );
      }
    );
    getForecastItems(endOfMonth(today), "Consumables").then((data) => {
      getForecastItems(endOfMonth(today), "Spares").then((data1) => {
        let total = (data as number) + (data1 as number);
        setForecastMonthCS(total);
      });
    });

    getTotalItems("ASSY01", startOfYear(today), today, null).then((data) =>
      setYTDItems(data as number)
    );
    getTotalItems(
      "ASSY01",
      startOfYear(todayLastYear),
      todayLastYear,
      null
    ).then((data) => setPreviousYTDItems(data as number));
    getTotalItems("ASSY01", startOfYear(today), today, "Machines").then(
      (data) => setYTDMachines(data as number)
    );
    getTotalItems(
      "ASSY01",
      startOfYear(todayLastYear),
      todayLastYear,
      "Machines"
    ).then((data) => setPreviousYTDMachines(data as number));
    getTotalItems("ASSY01", startOfYear(today), today, "Tools").then((data) =>
      setYTDTools(data as number)
    );
    getTotalItems(
      "ASSY01",
      startOfYear(todayLastYear),
      todayLastYear,
      "Tools"
    ).then((data) => setPreviousYTDTools(data as number));
    getTotalItems("ASSY01", startOfYear(today), today, "Consumables").then(
      (data) => {
        getTotalItems("ASSY01", startOfYear(today), today, "Spares").then(
          (data1) => {
            let total = (data as number) + (data1 as number);
            setYTDCS(total);
          }
        );
      }
    );
    getTotalItems(
      "ASSY01",
      startOfYear(todayLastYear),
      todayLastYear,
      "Consumables"
    ).then((data) => {
      getTotalItems(
        "ASSY01",
        startOfYear(todayLastYear),
        todayLastYear,
        "Spares"
      ).then((data1) => {
        let total = (data as number) + (data1 as number);
        setPreviousYTDCS(total);
      });
    });
  }, []);

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        minWidth: "100vw",
        height: "calc(100% - 54px)",
      }}
    >
      <Grid container height="50%">
        <Grid item xs={12} mx={5} mt={2.5}>
          <Typography
            variant="h2"
            component="div"
            fontSize={28}
            fontWeight="400"
            color={theme.palette.text.primary}
          >
            {format(new Date(), "LLLL")}
          </Typography>
        </Grid>
        <KPIPercentageCard
          label="No. of Items"
          value={monthItems}
          previous={forecastMonthItems}
          tooltip={`vs Forecast of ${format(todayLastYear, "LLLL yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Machines"
          value={monthMachines}
          previous={forecastMonthMachines}
          tooltip={`vs Forecast of ${format(todayLastYear, "LLLL yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Tools"
          value={monthTools}
          previous={forecastMonthTools}
          tooltip={`vs Forecast of ${format(todayLastYear, "LLLL yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Consumables and Spares"
          value={monthCS}
          previous={forecastMonthCS}
          tooltip={`vs Forecast of ${format(todayLastYear, "LLLL yyyy")}`}
        />
      </Grid>
      <Grid container height="50%">
        <Grid item xs={12} mx={5} mt={2.5}>
          <Typography
            variant="h2"
            component="div"
            fontSize={28}
            fontWeight="400"
            color={theme.palette.text.primary}
          >
            YTD
          </Typography>
        </Grid>
        <KPIPercentageCard
          label="No. of Items"
          value={ytdItems}
          previous={previousYTDItems}
          tooltip={`vs YTD of ${format(todayLastYear, "yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Machines"
          value={ytdMachines}
          previous={previousYTDMachines}
          tooltip={`vs YTD of ${format(todayLastYear, "yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Tools"
          value={ytdTools}
          previous={previousYTDTools}
          tooltip={`vs YTD of ${format(todayLastYear, "yyyy")}`}
        />
        <KPIPercentageCard
          label="No. of Consumables and Spares"
          value={ytdCS}
          previous={previousYTDCS}
          tooltip={`vs YTD of ${format(todayLastYear, "yyyy")}`}
        />
      </Grid>
    </Grid>
  );
}

function OperationsKPICharts() {
  const theme = useTheme();

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        minWidth: "100vw",
        height: "calc(100% - 54px)",
      }}
    >
      <Grid container height="50%">
        <Grid item xs={12} mx={5} mt={2.5}>
          <Typography
            variant="h2"
            component="div"
            fontSize={28}
            fontWeight="400"
            color={theme.palette.text.primary}
          >
            {format(new Date(), "LLLL")}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
