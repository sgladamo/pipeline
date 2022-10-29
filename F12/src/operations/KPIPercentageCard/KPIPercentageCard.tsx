import { ArrowDropUpRounded, ArrowDropDownRounded } from "@mui/icons-material";
import {
  Grid,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

interface KPIPercentageCardProps {
  label: string;
  value: number;
  previous?: number;
  tooltip: string;
}

function KPIPercentageCard(props: KPIPercentageCardProps) {
  const { label, value, previous, tooltip } = props;
  const theme = useTheme();

  const [percentage, setPercentage] = useState(
    previous ? (value / previous) * 100 : undefined
  );

  useEffect(() => {
    if (previous) {
      setPercentage((value / previous) * 100);
    }
  }, [value, previous]);

  function getTextColour() {
    if (previous) {
      return value >= previous
        ? theme.palette.success.main
        : theme.palette.error.main;
    } else {
      return theme.palette.text.primary;
    }
  }

  return (
    <Grid item xs={3}>
      <Tooltip disableInteractive title={tooltip}>
        <Card
          sx={{
            mx: 5,
            ":hover": {
              backgroundColor: theme.palette.action.hover,
              cursor: "pointer",
            },
          }}
          variant="outlined"
        >
          {percentage ? (
            <Carousel
              interval={7500}
              swipe={false}
              indicators={false}
              navButtonsAlwaysInvisible
              stopAutoPlayOnHover={false}
            >
              <div>
                <CardHeader
                  subheader={label}
                  sx={{
                    textAlign: "center",
                  }}
                />
                <CardContent
                  sx={{
                    minHeight: "100%",
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      pl={2.5}
                    >
                      <Typography
                        variant="h3"
                        component="div"
                        color={getTextColour()}
                      >
                        {value.toLocaleString()}
                      </Typography>
                      {previous && value < previous ? (
                        <ArrowDropDownRounded color="error" fontSize="large" />
                      ) : (
                        <ArrowDropUpRounded color="success" fontSize="large" />
                      )}
                    </Stack>
                    {percentage && (
                      <Typography variant="subtitle1" component="div">
                        {percentage.toFixed(2) + "%"}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </div>
              <div>
                <CardHeader
                  subheader={label}
                  sx={{
                    textAlign: "center",
                  }}
                />
                <CardContent
                  sx={{
                    pt: 0,
                  }}
                >
                  <Stack alignItems="center">
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={percentage > 100 ? 100 : percentage}
                        size={100}
                        color={percentage < 100 ? "error" : "success"}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="div"
                        >{`${percentage.toFixed(2)}%`}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </div>
            </Carousel>
          ) : (
            <div>
              <CardHeader
                subheader={label}
                sx={{
                  textAlign: "center",
                }}
              />
              <CardContent
                sx={{
                  minHeight: "100%",
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="h3"
                      component="div"
                      color={getTextColour()}
                    >
                      {value.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </div>
          )}
        </Card>
      </Tooltip>
    </Grid>
  );
}

export default KPIPercentageCard;
