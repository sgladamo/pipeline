import Carousel from "react-material-ui-carousel";
import OperationsDashboardView from "operations/OperationsDashboardView";
import AssemblyDashboardView from "operations/AssemblyDashboardView";
import CarouselContainer from "core/CarouselContainer";
import DespatchDashboardView from "despatch/DespatchDashboardView";

function CarouselView() {
  return (
    <Carousel interval={10000}>
      <CarouselContainer component="main">
        <OperationsDashboardView hideKPIs />
      </CarouselContainer>
      <CarouselContainer component="main">
        <AssemblyDashboardView />
      </CarouselContainer>
      <CarouselContainer component="main">
        <DespatchDashboardView />
      </CarouselContainer>
    </Carousel>
  );
}

export default CarouselView;
