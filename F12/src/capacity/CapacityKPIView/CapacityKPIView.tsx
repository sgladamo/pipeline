import { Grid, Typography, useTheme } from "@mui/material";
import { getHoursAvailable } from "capacity/fetch";
import KPIPercentageCard from "operations/KPIPercentageCard";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useLayoutEffect, useState } from "react";

function CapacityKPIView() {
  const theme = useTheme();

  const [today] = useState(new Date());

  const [monthHoursAvailable, setMonthHoursAvailable] = useState(0);

  useLayoutEffect(() => {
    getHoursAvailable(startOfMonth(today), endOfMonth(today)).then((data) =>
      setMonthHoursAvailable(data as number)
    );
  });

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
      <KPIPercentageCard
        label="Total Hours Available"
        value={monthHoursAvailable}
        tooltip={`of ${format(today, "LLLL yyyy")}`}
      />
    </Grid>
  );
}

export default CapacityKPIView;
