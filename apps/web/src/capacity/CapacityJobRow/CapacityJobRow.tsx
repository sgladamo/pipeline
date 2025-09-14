import { CapacityJob } from "capacity/models";
import AmberTableRow from "core/AmberTableRow";
import GreenTableRow from "core/GreenTableRow";
import RedTableRow from "core/RedTableRow";
import CapacityJobRowBody from "capacity/CapacityJobRowBody";
import PurpleTableRow from "core/PurpleTableRow";
import { Draggable } from "react-beautiful-dnd";
import { useContext } from "react";
import { CoreContext } from "core/context";

interface CapacityJobRowProps {
  capacityJob: CapacityJob;
  onClick: (job: CapacityJob) => void;
  index: number;
}

function CapacityJobRow(props: CapacityJobRowProps) {
  const { capacityJob, onClick, index } = props;
  const { loggedIn } = useContext(CoreContext);

  if (loggedIn) {
    if (capacityJob.workCentre === "PICK01") {
      return (
        <Draggable
          draggableId={capacityJob.capacityJobId}
          index={index}
          key={capacityJob.capacityJobId}
        >
          {(provided) => {
            return (
              <PurpleTableRow
                key={capacityJob.capacityJobId}
                onClick={() => onClick(capacityJob)}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                <CapacityJobRowBody capacityJob={capacityJob} />
              </PurpleTableRow>
            );
          }}
        </Draggable>
      );
    } else {
      if (capacityJob.priority <= 29) {
        return (
          <Draggable
            draggableId={capacityJob.capacityJobId}
            index={index}
            key={capacityJob.capacityJobId}
          >
            {(provided) => {
              return (
                <RedTableRow
                  key={capacityJob.capacityJobId}
                  onClick={() => onClick(capacityJob)}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <CapacityJobRowBody capacityJob={capacityJob} />
                </RedTableRow>
              );
            }}
          </Draggable>
        );
      } else if (capacityJob.priority >= 30 && capacityJob.priority <= 49) {
        return (
          <Draggable
            draggableId={capacityJob.capacityJobId}
            index={index}
            key={capacityJob.capacityJobId}
          >
            {(provided) => {
              return (
                <AmberTableRow
                  key={capacityJob.capacityJobId}
                  onClick={() => onClick(capacityJob)}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <CapacityJobRowBody capacityJob={capacityJob} />
                </AmberTableRow>
              );
            }}
          </Draggable>
        );
      } else {
        return (
          <Draggable
            draggableId={capacityJob.capacityJobId}
            index={index}
            key={capacityJob.capacityJobId}
          >
            {(provided) => {
              return (
                <GreenTableRow
                  key={capacityJob.capacityJobId}
                  onClick={() => onClick(capacityJob)}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  <CapacityJobRowBody capacityJob={capacityJob} />
                </GreenTableRow>
              );
            }}
          </Draggable>
        );
      }
    }
  } else {
    if (capacityJob.workCentre === "PICK01") {
      return (
        <PurpleTableRow
          key={capacityJob.capacityJobId}
          onClick={() => onClick(capacityJob)}
        >
          <CapacityJobRowBody capacityJob={capacityJob} />
        </PurpleTableRow>
      );
    } else {
      if (capacityJob.priority <= 29) {
        return (
          <RedTableRow
            key={capacityJob.capacityJobId}
            onClick={() => onClick(capacityJob)}
          >
            <CapacityJobRowBody capacityJob={capacityJob} />
          </RedTableRow>
        );
      } else if (capacityJob.priority >= 30 && capacityJob.priority <= 49) {
        return (
          <AmberTableRow
            key={capacityJob.capacityJobId}
            onClick={() => onClick(capacityJob)}
          >
            <CapacityJobRowBody capacityJob={capacityJob} />
          </AmberTableRow>
        );
      } else {
        return (
          <GreenTableRow
            key={capacityJob.capacityJobId}
            onClick={() => onClick(capacityJob)}
          >
            <CapacityJobRowBody capacityJob={capacityJob} />
          </GreenTableRow>
        );
      }
    }
  }
}

export default CapacityJobRow;
