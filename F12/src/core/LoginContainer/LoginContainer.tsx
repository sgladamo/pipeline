import {
  Close,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
  useTheme,
} from "@mui/material";
import { login } from "core/fetch";
import { useState } from "react";
import { useCookies } from "react-cookie";

interface LoginContainerProps {
  handleClose: () => void;
}

function LoginContainer(props: LoginContainerProps) {
  const { handleClose } = props;
  const theme = useTheme();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["F12_SESSION_ID"]);
  const [error, setError] = useState(false);

  function handleOnChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setPassword(event.target.value);
  }

  function handleOnSubmit(event: any) {
    event.preventDefault();
    login(password).then((response) => {
      if (response) {
        setCookies("F12_SESSION_ID", response);
        handleClose();
      } else {
        setError(true);
      }
    });
  }

  return (
    <>
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        elevation={0}
      >
        <Tooltip title="Close" disableInteractive>
          <IconButton
            onClick={handleClose}
            color="inherit"
            sx={{
              position: "absolute",
              right: 0,
              mr: 2.25,
              mt: "56px",
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </AppBar>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100%" }}
      >
        <Grid item xs={3} sx={{ mb: 10 }}>
          <form onSubmit={handleOnSubmit}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="capacity-password">Password</InputLabel>
              <OutlinedInput
                id="capacity-password"
                type={showPassword ? "text" : "password"}
                autoComplete="on"
                value={password}
                onChange={handleOnChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffRounded />
                      ) : (
                        <VisibilityRounded />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2.5 }}
                onClick={handleOnSubmit}
              >
                Login
              </Button>
            </FormControl>
            <FormHelperText
              sx={{
                color: error ? theme.palette.error.main : null,
                mt: 2.5,
                textAlign: "center",
              }}
            >
              {error && "Incorrect password."}
            </FormHelperText>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default LoginContainer;
