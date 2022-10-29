import {
  Grid,
  Card,
  Stack,
  CardContent,
  CardHeader,
  useTheme,
} from "@mui/material";
import { View } from "core/models";
import { useNavigate } from "react-router-dom";

interface HomeViewCardProps {
  view: View;
}

function HomeViewCard(props: HomeViewCardProps) {
  const { view } = props;
  const { name, description, icon } = view;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={12} lg={6} sm key={name} padding={4}>
      <Card
        key={name}
        onClick={() => navigate(view.route)}
        sx={{
          minHeight: "100%",
          display: "flex",
          ":hover": {
            backgroundColor: theme.palette.action.hover,
            cursor: "pointer",
          },
        }}
        variant="outlined"
      >
        <Stack
          direction="row"
          sx={{
            m: 2,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {icon}
          </CardContent>
          <CardHeader title={name} subheader={description} />
        </Stack>
      </Card>
    </Grid>
  );
}

export default HomeViewCard;
