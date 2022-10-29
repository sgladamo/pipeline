import { Grid, Typography, useTheme } from "@mui/material";

interface HomeViewHeaderProps {
  title: string;
}

function HomeViewHeader(props: HomeViewHeaderProps) {
  const { title } = props;
  const theme = useTheme();

  return (
    <Grid item xs={12} paddingX={4}>
      <Typography
        variant="h2"
        component="div"
        fontSize={28}
        fontWeight="400"
        color={theme.palette.text.primary}
      >
        {title}
      </Typography>
    </Grid>
  );
}

export default HomeViewHeader;
