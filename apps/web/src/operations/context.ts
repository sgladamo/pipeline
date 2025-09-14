import { createContext, SetStateAction } from "react";
import { WipCurrentOp } from "operations/models";

interface IOperationsContext {
  currentPickingOp: WipCurrentOp | undefined;
  setCurrentPickingOp: (
    value: SetStateAction<WipCurrentOp | undefined>
  ) => void;
}

export const OperationsContext = createContext<IOperationsContext>({
  currentPickingOp: undefined,
  setCurrentPickingOp: (value: SetStateAction<WipCurrentOp | undefined>) => {},
});
