import { Grid, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { CoreContext } from "core/context";
import { differenceInDays, format } from "date-fns";

function ActivationView() {
  const theme = useTheme();
  const { activationState } = useContext(CoreContext);

  return (
    <Grid
      container
      rowSpacing={0}
      columnSpacing={0}
      sx={{
        minWidth: "100vw",
        height: "calc(100% - 54px)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack width={600} spacing={2.5} textAlign="center">
        {activationState?.code ? (
          <>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Typography variant="h6" color={theme.palette.text.primary}>
                Status:
              </Typography>
              <Typography
                variant="h6"
                color={
                  activationState.status
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }
              >
                {activationState.status ? "Active" : "Not Active"}
              </Typography>
            </Stack>
            {activationState.endDate && (
              <Stack direction="row" spacing={1} justifyContent="center">
                <Typography variant="h6" color={theme.palette.text.primary}>
                  Expiration:{" "}
                </Typography>
                <Typography variant="h6" color={theme.palette.text.primary}>
                  {format(
                    Date.parse(activationState.endDate.toString()),
                    "dd/MM/yyyy"
                  )}
                </Typography>
                <Typography variant="h6" color={theme.palette.text.primary}>
                  (
                  {differenceInDays(
                    new Date(activationState.endDate),
                    new Date()
                  )}{" "}
                  days)
                </Typography>
              </Stack>
            )}
            <Stack spacing={1}>
              <Typography variant="h6" color={theme.palette.text.primary}>
                Your Activation Code:
              </Typography>
              <TextField
                fullWidth
                value={activationState.code ? activationState.code : ""}
                multiline
                spellCheck={false}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="h6" color={theme.palette.text.primary}>
                Your Activation Key:
              </Typography>
              <TextField
                fullWidth
                defaultValue={activationState.key ? activationState.key : ""}
                multiline
                spellCheck={false}
              />
            </Stack>
          </>
        ) : (
          <Typography variant="h6" color={theme.palette.text.primary}>
            Something went wrong.
          </Typography>
        )}
      </Stack>
    </Grid>
  );
}

export default ActivationView;
