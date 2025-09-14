import { CapacityDay } from "capacity/models";
import DefaultTableCell from "core/DefaultTableCell";
import CapacityTableCell from "capacity/CapacityTableCell";
import CapacityTableRow from "capacity/CapacityTableRow";
import { useTheme } from "@mui/material";

interface CapacityHoursRowProps {
  capacityDays: CapacityDay[];
  selectCapacityDay: (value: CapacityDay) => void;
}

function CapacityHoursRow(props: CapacityHoursRowProps) {
  const { capacityDays, selectCapacityDay } = props;
  const theme = useTheme();

  return (
    <CapacityTableRow>
      <CapacityTableCell component="th" scope="row" />
      {capacityDays.map((capacityDay) => {
        return (
          <DefaultTableCell
            onClick={() => selectCapacityDay(capacityDay)}
            key={capacityDay.capacityDayId + "-hours"}
            sx={{
              borderRight: `0.5px solid ${theme.palette.divider}`,
              ":hover": {
                cursor: "pointer",
                backgroundColor: theme.palette.action.focus,
              },
            }}
          >
            {capacityDay.availableHours}
          </DefaultTableCell>
        );
      })}
    </CapacityTableRow>
  );
}

export default CapacityHoursRow;
