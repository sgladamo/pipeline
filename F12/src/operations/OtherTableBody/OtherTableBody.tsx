import { TableBody } from "@mui/material";
import { OtherCells } from "core/consts";
import { CoreContext } from "core/context";
import { WipCurrentOp } from "operations/models";
import { requestSearch } from "core/utils";
import DefaultTableCell from "core/DefaultTableCell";
import DefaultTableRow from "core/DefaultTableRow";
import { useContext, useState, useLayoutEffect } from "react";

interface OtherTableBodyProps {
  assemblyOps: WipCurrentOp[];
  handleOnJobSelection: (op: WipCurrentOp) => void;
}

function OtherTableBody(props: OtherTableBodyProps) {
  const { assemblyOps, handleOnJobSelection } = props;
  const { searchValue } = useContext(CoreContext);

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
    setOpsState(filtered);
  }, [assemblyOps, searchValue]);

  return (
    <TableBody>
      {opsState?.map((op) => {
        if (
          op.holdFlag === "Y" ||
          OtherCells.find((x) => x === op.workCentre || x === op.iMachine)
        ) {
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
        } else {
          return null;
        }
      })}
    </TableBody>
  );
}

export default OtherTableBody;
