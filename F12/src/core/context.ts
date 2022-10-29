import { createContext, SetStateAction } from "react";
import { ActivationState } from "core/models";

interface ICoreContext {
  loggedIn: boolean;
  searchValue: string;
  activationState: ActivationState | undefined;
  setActivationState: (
    value: SetStateAction<ActivationState | undefined>
  ) => void;
}

export const CoreContext = createContext<ICoreContext>({
  loggedIn: false,
  searchValue: "",
  activationState: undefined,
  setActivationState: (
    value: SetStateAction<ActivationState | undefined>
  ) => {},
});
