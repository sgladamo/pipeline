import { DESPDashboard } from "despatch/models";
import GreenTableRow from "core/GreenTableRow";
import RedTableRow from "core/RedTableRow";
import DespatchTableRow from "despatch/DespatchTableRow";

interface DespatchTableProps {
  table: string;
  items: DESPDashboard[] | undefined;
}

function DespatchTable(props: DespatchTableProps) {
  const { table, items } = props;

  return (
    <>
      {items?.map((item) => {
        if (item && item.actualDeliveryDate) {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          if (new Date(item.actualDeliveryDate.toString()) >= today) {
            return (
              <GreenTableRow key={item.dispatchNote}>
                <DespatchTableRow table={table} item={item} />
              </GreenTableRow>
            );
          } else {
            return (
              <RedTableRow key={item.dispatchNote}>
                <DespatchTableRow table={table} item={item} />
              </RedTableRow>
            );
          }
        } else {
          return null;
        }
      })}
    </>
  );
}

export default DespatchTable;
