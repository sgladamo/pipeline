import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { fetchLostHours, updateLostHours } from "capacity/fetch";
import { format } from "date-fns";
import { useLayoutEffect, useState } from "react";

interface CapacityLostHoursDialogProps {
  month: Date | undefined;
  handleClose: () => void;
}

function CapacityLostHoursDialog(props: CapacityLostHoursDialogProps) {
  const { month, handleClose } = props;
  const theme = useTheme();

  const [quality, setQuality] = useState("");
  const [qualityError, setQualityError] = useState(false);
  const [other, setOther] = useState("");
  const [otherError, setOtherError] = useState(false);

  useLayoutEffect(() => {
    if (month) {
      fetchLostHours(month).then((data) => {
        setQuality((data?.quality as number).toString());
        setOther((data?.other as number).toString());
      });
    }
  }, [month]);

  function handleOnQualityChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let val = event.target.value;
    setQuality(val);
    let num = Number(val);
    if (val === "0") {
      setQualityError(false);
    } else if (num && num >= 0) {
      setQualityError(false);
    } else {
      setQualityError(true);
    }
  }

  function handleOnOtherChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let val = event.target.value;
    setOther(val);
    let num = Number(val);
    if (val === "0") {
      setOtherError(false);
    } else if (num && num >= 0) {
      setOtherError(false);
    } else {
      setOtherError(true);
    }
  }

  function handleOnOk() {
    if (!qualityError && !otherError) {
      let qualityVal = Number(quality);
      let otherVal = Number(other);
      updateLostHours(month as Date, qualityVal, otherVal);
      handleClose();
    }
  }

  return (
    <Dialog onClose={handleClose} open={Boolean(month)}>
      <DialogTitle sx={{ mr: 5 }}>
        Lost Hours - {month && format(month, "LLLL yyyy")}
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
        <DialogContentText
          sx={{
            mx: 5,
          }}
        >
          Quality
        </DialogContentText>
        <OutlinedInput
          value={quality}
          onChange={handleOnQualityChange}
          endAdornment={<InputAdornment position="end">hrs</InputAdornment>}
          autoFocus
          error={qualityError}
          sx={{
            mx: 5,
            my: 2.5,
          }}
        />
        <FormHelperText
          sx={{
            color: qualityError ? theme.palette.error.main : null,
            mx: 5,
          }}
        >
          {qualityError
            ? "Please enter a valid number"
            : "Adjust lost hours due to Quality"}
        </FormHelperText>
        <DialogContentText
          sx={{
            mx: 5,
            mt: 2.5,
          }}
        >
          Other
        </DialogContentText>
        <OutlinedInput
          value={other}
          onChange={handleOnOtherChange}
          endAdornment={<InputAdornment position="end">hrs</InputAdornment>}
          autoFocus
          error={otherError}
          sx={{
            mx: 5,
            my: 2.5,
          }}
        />
        <FormHelperText
          sx={{
            color: otherError ? theme.palette.error.main : null,
            mx: 5,
          }}
        >
          {otherError
            ? "Please enter a valid number"
            : "Adjust lost hours due to Other"}
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

export default CapacityLostHoursDialog;
