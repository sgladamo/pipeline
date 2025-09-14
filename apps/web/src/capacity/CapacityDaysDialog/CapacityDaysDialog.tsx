import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { updateCapacityDay } from "capacity/fetch";
import { CapacityDay } from "capacity/models";
import { format } from "date-fns";
import { useLayoutEffect, useState } from "react";

interface CapacityDaysDialogProps {
  capacityDay?: CapacityDay;
  handleClose: () => void;
}

function CapacityDaysDialog(props: CapacityDaysDialogProps) {
  const { capacityDay, handleClose } = props;
  const theme = useTheme();

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    if (capacityDay) {
      setValue(String(capacityDay?.availableHours));
      setError(false);
    }
  }, [capacityDay]);

  function handleOnChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let val = event.target.value;
    setValue(val);
    let num = Number(val);
    if (val === "0") {
      setError(false);
    } else if (num && num >= 0 && num <= 24) {
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleOnOk() {
    if (!error) {
      let val = Number(value);
      if (val !== capacityDay?.availableHours) {
        updateCapacityDay(capacityDay?.capacityDayId as string, val);
      }
      handleClose();
    }
  }

  return (
    <Dialog onClose={handleClose} open={Boolean(capacityDay)}>
      <DialogTitle>
        {capacityDay?.cell}
        {" - "}
        {capacityDay &&
          format(Date.parse(capacityDay.day.toString()), "dd/MM/yy")}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <OutlinedInput
          value={value}
          onChange={handleOnChange}
          endAdornment={<InputAdornment position="end">hrs</InputAdornment>}
          autoFocus
          error={error}
          sx={{
            mx: 2.5,
            my: 2.5,
          }}
        />
        <FormHelperText
          sx={{
            color: error ? theme.palette.error.main : null,
            mx: 2.5,
          }}
        >
          {error
            ? "Please enter a valid number between 0 and 24"
            : "Adjust available hours in the day"}
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleOnOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CapacityDaysDialog;
