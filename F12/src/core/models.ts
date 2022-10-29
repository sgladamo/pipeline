export type View = {
  name?: string;
  description?: string;
  route: string;
  icon?: any;
};

export type WipJobAllLab = {
  job?: string;
  operation?: number;
  workCentre?: string;
  workCentreDesc?: string;
  operCompleted?: string;
  plannedEndDate?: Date;
  iMachine?: string;
};

export type ActivationState = {
  status?: boolean;
  code?: string;
  key?: string;
  endDate?: Date;
};
