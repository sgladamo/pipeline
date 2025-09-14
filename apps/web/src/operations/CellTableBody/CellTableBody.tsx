import { TableBody } from "@mui/material";
import { CoreContext } from "core/context";
import { WipCurrentOp } from "operations/models";
import { requestSearch } from "core/utils";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import GreenTableRow from "core/GreenTableRow";
import { useContext, useLayoutEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface CellTableBodyProps {
  cell: string;
  assemblyOps: WipCurrentOp[];
  trolleyStorageOps: WipCurrentOp[];
  handleOnJobSelection: (op: WipCurrentOp) => void;
}

function CellTableBody(props: CellTableBodyProps) {
  const { cell, assemblyOps, trolleyStorageOps, handleOnJobSelection } = props;
  const { searchValue, loggedIn } = useContext(CoreContext);

  const [opsState, setOpsState] = useState<WipCurrentOp[]>([]);

  useLayoutEffect(() => {
    let filtered: WipCurrentOp[] = [];
    if (assemblyOps) {
      assemblyOps.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    if (trolleyStorageOps) {
      trolleyStorageOps.forEach((op) => {
        if (requestSearch(searchValue, op)) {
          filtered.push({ ...op });
        }
      });
    }
    setOpsState(filtered);
  }, [assemblyOps, trolleyStorageOps, searchValue]);

  return (
    <>
      <TableBody>
        {opsState
          .filter((op) => cell === op.workCentre || cell === op.iMachine)
          .map((op) => {
            return (
              <GreenTableRow
                key={op.job}
                onClick={() => handleOnJobSelection(op)}
              >
                <DefaultTableCell component="th" scope="row">
                  {op.job?.replace("000000000", "")}
                </DefaultTableCell>
                <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                <DefaultTableCell>{op.stockDescription}</DefaultTableCell>
                <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                <DefaultTableCell>{op.priority}</DefaultTableCell>
                <DefaultTableCell>
                  {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                </DefaultTableCell>
                <DefaultTableCell>
                  {op.nextWorkCentre === "ASSY01"
                    ? op.nextWorkCentreIMachine
                    : op.nextWorkCentre}
                </DefaultTableCell>
              </GreenTableRow>
            );
          })}
      </TableBody>
      {loggedIn ? (
        <Droppable droppableId={cell} type="ROW">
          {(provided) => (
            <>
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {opsState
                  .filter(
                    (op) =>
                      cell === op.nextWorkCentre ||
                      cell === op.nextWorkCentreIMachine
                  )
                  .map((op, index) => {
                    return (
                      <Draggable
                        draggableId={op.job as string}
                        index={index}
                        key={op.job as string}
                      >
                        {(provided) => {
                          return (
                            <DefaultTableRow
                              key={op.job}
                              onClick={() => handleOnJobSelection(op)}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <DefaultTableCell component="th" scope="row">
                                {op.job?.replace("000000000", "")}
                              </DefaultTableCell>
                              <DefaultTableCell>
                                {op.stockCode}
                              </DefaultTableCell>
                              <DefaultTableCell>
                                {op.stockDescription}
                              </DefaultTableCell>
                              <DefaultTableCell>
                                {op.qtyToMake}
                              </DefaultTableCell>
                              <DefaultTableCell>{op.priority}</DefaultTableCell>
                              <DefaultTableCell>
                                {(op.priority as number) <= 19
                                  ? "Sales"
                                  : "Stock"}
                              </DefaultTableCell>
                              <DefaultTableCell>
                                {op.nextWorkCentre === "ASSY01"
                                  ? op.nextWorkCentreIMachine
                                  : op.nextWorkCentre}
                              </DefaultTableCell>
                            </DefaultTableRow>
                          );
                        }}
                      </Draggable>
                    );
                  })}
              </TableBody>
              {provided.placeholder}
            </>
          )}
        </Droppable>
      ) : (
        <TableBody>
          {opsState
            .filter(
              (op) =>
                cell === op.nextWorkCentre || cell === op.nextWorkCentreIMachine
            )
            .map((op) => {
              return (
                <DefaultTableRow
                  key={op.job}
                  onClick={() => handleOnJobSelection(op)}
                >
                  <DefaultTableCell component="th" scope="row">
                    {op.job?.replace("000000000", "")}
                  </DefaultTableCell>
                  <DefaultTableCell>{op.stockCode}</DefaultTableCell>
                  <DefaultTableCell>{op.stockDescription}</DefaultTableCell>
                  <DefaultTableCell>{op.qtyToMake}</DefaultTableCell>
                  <DefaultTableCell>{op.priority}</DefaultTableCell>
                  <DefaultTableCell>
                    {(op.priority as number) <= 19 ? "Sales" : "Stock"}
                  </DefaultTableCell>
                  <DefaultTableCell>
                    {op.nextWorkCentre === "ASSY01"
                      ? op.nextWorkCentreIMachine
                      : op.nextWorkCentre}
                  </DefaultTableCell>
                </DefaultTableRow>
              );
            })}
        </TableBody>
      )}
    </>
  );
}

export default CellTableBody;
