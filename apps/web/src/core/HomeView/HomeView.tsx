import {
  AccountTreeRounded,
  FactCheckRounded,
  GridOnRounded,
  OutboxRounded,
  ViewCarouselRounded,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { View } from "core/models";
import DashboardFab from "core/DashboardFab";
import HomeViewCard from "core/HomeViewCard";
import HomeViewHeader from "core/HomeViewHeader";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { CapacityIcon } from "core/icons";

const views: View[] = [
  {
    name: "Operations",
    description: "View Operations Dashboard",
    route: "/operations",
    icon: <AccountTreeRounded sx={{ fontSize: 48 }} />,
  },
  {
    name: "Assembly",
    description: "View Assembly Cells Dashboard",
    route: "/assembly",
    icon: <GridOnRounded sx={{ fontSize: 48 }} />,
  },
  {
    name: "Picking",
    description: "View all Picking Jobs, or select a job to work on",
    route: "/picking",
    icon: <FactCheckRounded sx={{ fontSize: 48 }} />,
  },
  {
    name: "Despatch",
    description: "View Despatch Dashboard",
    route: "/despatch",
    icon: <OutboxRounded sx={{ fontSize: 48 }} />,
  },
  {
    name: "Capacity Management",
    description: "View and manage Capacity for your business",
    route: "/capacity",
    icon: <CapacityIcon sx={{ fontSize: 48 }} />,
  },
];

function HomeView() {
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={2}
      sx={{
        width: "100%",
        paddingX: windowSize.width / 35,
        paddingTop: 5,
        margin: 0,
      }}
    >
      <HomeViewHeader title="Dashboards" />
      {views.map((view) => {
        return <HomeViewCard view={view} key={view.name} />;
      })}
      <DashboardFab
        action={() => navigate("/carousel")}
        tooltip="View Carousel"
        icon={<ViewCarouselRounded />}
      />
    </Grid>
  );
}

export default HomeView;
