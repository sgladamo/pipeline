import { QrCodeRounded } from "@mui/icons-material";
import { Box, Stack, Chip, Typography, Button, useTheme } from "@mui/material";
import { WipJobPickList } from "operations/models";

interface PickingListFooterProps {
  pickList: WipJobPickList[];
  picked: WipJobPickList[];
  showBarcode: () => void;
}

function PickingListFooter(props: PickingListFooterProps) {
  const { pickList, picked, showBarcode } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "space-between",
        borderTop: `0.5px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        sx={{
          py: 1,
          ml: 2,
        }}
      >
        <Chip
          label={`${picked.length} / ${pickList.length}`}
          variant="outlined"
          sx={{ mr: 2 }}
          size="small"
          color="primary"
        />
        <Typography fontSize={16} sx={{ verticalAlign: "center" }}>
          Items Picked
        </Typography>
      </Stack>
      <Button
        variant="text"
        endIcon={<QrCodeRounded />}
        disabled={picked.length !== pickList.length}
        onClick={showBarcode}
        sx={{
          mr: 2,
        }}
      >
        Complete
      </Button>
    </Box>
  );
}

export default PickingListFooter;
