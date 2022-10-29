import { Stack, Box } from "@mui/material";
import { CapacityJob } from "capacity/models";

interface CapacityJobRowBodyPops {
  capacityJob: CapacityJob;
}

function CapacityJobRowBody(props: CapacityJobRowBodyPops) {
  const { capacityJob } = props;

  return (
    <Stack
      sx={{
        minWidth: "200px",
        p: 0.25,
      }}
    >
      <Box>
        Job: <strong>{capacityJob.job.replace("000000000", "")}</strong>{" "}
        Priority: <strong>{capacityJob.priority}</strong>
      </Box>
      <Box>
        Code: <strong>{capacityJob.stockCode}</strong> Qty:{" "}
        <strong>{capacityJob.qty}</strong>
      </Box>
      <Box>
        <strong>{capacityJob.stockDescription}</strong>
      </Box>
    </Stack>
  );
}

export default CapacityJobRowBody;
