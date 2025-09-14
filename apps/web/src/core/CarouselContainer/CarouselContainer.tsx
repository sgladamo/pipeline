import { Box, styled } from "@mui/material";

const CarouselContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: "calc(100vh - 96px)",
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export default CarouselContainer;
