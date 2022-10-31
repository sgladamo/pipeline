import {
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Button,
  Stack,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CoreContext } from "core/context";
import { MouseEvent, useLayoutEffect, useMemo, useState } from "react";
import { WipCurrentOp } from "operations/models";
import { Close, DarkMode, ExpandMore, LightMode } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";
import AssemblyDashboardView from "operations/AssemblyDashboardView";
import CapacityKPIView from "capacity/CapacityKPIView";
import CapacityView from "capacity/CapacityView";
import DespatchDashboardView from "despatch/DespatchDashboardView";
import OperationsKPIView from "operations/OperationsKPIView";
import PickingDashboardView from "operations/PickingDashboardView";
import OperationsDashboardView from "operations/OperationsDashboardView";
import PickingView from "operations/PickingView";
import HomeView from "core/HomeView";
import CarouselView from "core/CarouselView";
import LoginContainer from "core/LoginContainer";
import { authenticate, fetchActivationState } from "core/fetch";
import { useCookies } from "react-cookie";
import { OperationsContext } from "operations/context";
import Searchbar from "core/Searchbar";
import ActivationView from "core/ActivationView/ActivationView";
import { ActivationState } from "core/models";
import { differenceInDays } from "date-fns";
import Logo from "resources/svgs/logo.svg";

const SearchableRoutes = [
  "/carousel",
  "/operations",
  "/assembly",
  "/picking",
  "/despatch",
];

function RootView() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activationState, setActivationState] = useState<ActivationState>();
  const [activationSnackbar, setActivationSnackbar] = useState(false);
  const [activationSnackbarShown, setActivationSnackbarShown] = useState(false);
  const [mode, setMode] = useLocalStorage<"light" | "dark">(
    "F12_THEME",
    "light"
  );
  const [menu, setMenu] = useState<HTMLElement | undefined>();
  const [currentPickingOp, setCurrentPickingOp] = useState<WipCurrentOp>();
  const [loginVisible, setLoginVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["F12_SESSION_ID"]);
  const [searchValue, setSearchValue] = useState("");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: mode === "dark" ? "#ffffffb3" : "#00000099",
            // main: mode === "dark" ? "#005ECE" : "#006DF0",
            // main: "#e51a0a"
          },
          secondary: {
            main: "#ffffff",
          },
          info: {
            main: "#006DF0",
            dark: "#005ECE",
          },
          success: {
            main: "#7ED63E",
            dark: "#5EAC24",
          },
          error: {
            main: "#ED1C24",
            dark: "#D80027",
          },
          warning: {
            main: "#FFCD00",
            dark: "#EBBF00",
          },
        },
        typography: {
          fontFamily: ["Open Sans", "Roboto", "sans-serif"].join(","),
        },
      }),
    [mode]
  );

  useLayoutEffect(() => checkActivation(), []);

  useLayoutEffect(() => {
    if (!activationState?.status && location.pathname !== "/activation") {
      navigate("/activation");
    }
  }, [location]);

  useLayoutEffect(() => {
    // try initial login
    if (cookies.F12_SESSION_ID) {
      authenticate(cookies.F12_SESSION_ID).then((response) => {
        if (response) {
          setLoggedIn(true);
        } else {
          removeCookies("F12_SESSION_ID");
        }
      });
    }
  }, [cookies, removeCookies]);

  useLayoutEffect(() => {
    setSearchValue("");
  }, [location]);

  function checkActivation() {
    fetchActivationState().then((response) => {
      setActivationState(response);
      if (!response?.status) {
        navigate("/activation");
      } else if (response.endDate) {
        if (differenceInDays(new Date(response.endDate), new Date()) <= 30) {
          setActivationSnackbar(true);
        }
      }
    });
  }

  function handleOpenMenu(event: MouseEvent<HTMLElement>) {
    setMenu(event.currentTarget);
  }

  function closeMenu() {
    setMenu(undefined);
  }

  function changeThemeMode(value: "light" | "dark") {
    setMode(value);
  }

  function handleCloseActivationSnackbar() {
    setActivationSnackbar(false);
    setActivationSnackbarShown(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: `0.5px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          {SearchableRoutes.find((x) => x === location.pathname) && (
            <Searchbar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          )}
          <Stack
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translate(-50%, 0)",
              ":hover": {
                cursor: "pointer",
              },
              display: "flex",
            }}
            alignItems="center"
            direction="row"
            spacing={0.5}
            height="100%"
          >
            <img
              style={{
                width: "26px",
                paddingTop: "1px",
              }}
              src={Logo}
              alt="logo"
            />
            <Stack direction="row">
              <Typography
                fontSize={32}
                color={theme.palette.text.secondary}
                fontWeight="bold"
              >
                PIPE
              </Typography>
              <Typography fontSize={32} color={theme.palette.text.secondary}>
                LINE
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            sx={{
              position: "absolute",
              right: 0,
              mr: 2,
            }}
          >
            {!loginVisible && !loggedIn && (
              <Button color="inherit" onClick={() => setLoginVisible(true)}>
                Login
              </Button>
            )}
            <Tooltip title="Settings" disableInteractive>
              <IconButton onClick={handleOpenMenu} color="inherit">
                <ExpandMore />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={menu}
        open={Boolean(menu)}
        onClose={closeMenu}
        elevation={0}
        PaperProps={{
          elevation: 1,
          sx: {
            border: `0.5px solid ${theme.palette.divider}`,
            borderTop: "none",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        }}
      >
        <MenuItem
          disableRipple
          sx={{
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <ToggleButtonGroup
            value={theme.palette.mode === "light" ? "left" : "center"}
            exclusive
          >
            <ToggleButton value="left" onClick={() => changeThemeMode("light")}>
              <Tooltip disableInteractive title="Light Mode">
                <LightMode />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="center"
              onClick={() => changeThemeMode("dark")}
            >
              <Tooltip disableInteractive title="Dark Mode">
                <DarkMode />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </MenuItem>
      </Menu>
      <CoreContext.Provider
        value={{
          loggedIn: loggedIn,
          searchValue: searchValue,
          activationState: activationState,
          setActivationState: setActivationState,
        }}
      >
        <OperationsContext.Provider
          value={{
            currentPickingOp: currentPickingOp,
            setCurrentPickingOp: setCurrentPickingOp,
          }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "calc(100vh - 49px)",
              overflow: "auto",
              marginTop: 6,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {loginVisible ? (
              <LoginContainer handleClose={() => setLoginVisible(false)} />
            ) : (
              <Routes>
                <Route index element={<HomeView />} />
                <Route path="/" element={<HomeView />} />
                <Route path="/activation" element={<ActivationView />} />
                <Route path="/carousel" element={<CarouselView />} />
                <Route
                  path="/operations"
                  element={<OperationsDashboardView />}
                />
                <Route
                  path="/operations/kpis"
                  element={<OperationsKPIView />}
                />
                <Route path="/assembly" element={<AssemblyDashboardView />} />
                <Route path="/picking" element={<PickingDashboardView />} />
                <Route path="/picking/:job" element={<PickingView />} />
                <Route path="/despatch" element={<DespatchDashboardView />} />
                <Route path="/capacity" element={<CapacityView />} />
                <Route path="/capacity/kpis" element={<CapacityKPIView />} />
              </Routes>
            )}
          </Box>
          <Snackbar
            open={activationSnackbar && !activationSnackbarShown}
            onClose={handleCloseActivationSnackbar}
            autoHideDuration={10000}
          >
            <Alert
              severity="info"
              onClose={handleCloseActivationSnackbar}
              variant="outlined"
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseActivationSnackbar}
                >
                  <Close fontSize="small" />
                </IconButton>
              }
            >
              {activationState &&
                activationState.endDate &&
                differenceInDays(
                  new Date(activationState.endDate),
                  new Date()
                )}{" "}
              Days Until Licence Expires.
            </Alert>
          </Snackbar>
        </OperationsContext.Provider>
      </CoreContext.Provider>
    </ThemeProvider>
  );
}

export default RootView;
