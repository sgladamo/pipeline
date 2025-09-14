import { DESPDashboard } from "despatch/models";
import { format } from "date-fns";
import DefaultTableCell from "core/DefaultTableCell";

function getLastColumnValue(table: string, item: DESPDashboard) {
  switch (table) {
    case "To Be Picked":
      return item.comment;
    case "Completed":
      return item.readyToCollect ? "Yes" : "No";
    default:
      return item.status;
  }
}

interface DespatchTableRowProps {
  table: string;
  item: DESPDashboard;
}

export function DespatchTableRow(props: DespatchTableRowProps) {
  const { table, item } = props;
  return (
    <>
      <DefaultTableCell component="th" scope="row">
        {item.dispatchNote?.replace("000000000", "")}
      </DefaultTableCell>
      <DefaultTableCell>
        {item.salesOrder?.replace("000000000", "")}
      </DefaultTableCell>
      <DefaultTableCell>{item.priority ? item.priority : ""}</DefaultTableCell>
      <DefaultTableCell>{item.packingInstructions}</DefaultTableCell>
      <DefaultTableCell>{item.accountNumber}</DefaultTableCell>
      <DefaultTableCell>{item.customer}</DefaultTableCell>
      <DefaultTableCell>
        {item.actualDeliveryDate &&
          format(Date.parse(item.actualDeliveryDate.toString()), "dd/MM/yy")}
      </DefaultTableCell>
      <DefaultTableCell>{getLastColumnValue(table, item)}</DefaultTableCell>
    </>
  );
}

export default DespatchTableRow;
