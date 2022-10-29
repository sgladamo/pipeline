import { Fab, Tooltip } from "@mui/material";

interface DashboardFabProps {
  action: () => void;
  tooltip: string;
  icon: JSX.Element;
}

function DashboardFab(props: DashboardFabProps) {
  const { action, tooltip, icon } = props;

  return (
    <Tooltip title={tooltip} disableInteractive>
      <Fab
        sx={{
          margin: 0,
          top: "auto",
          right: 75,
          bottom: 50,
          left: "auto",
          position: "fixed",
        }}
        onClick={action}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
}

export default DashboardFab;
