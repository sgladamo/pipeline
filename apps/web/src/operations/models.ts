export type DashboardTable = {
  name: string;
  workCentres: string[];
};

export type WipCurrentOp = {
  job?: string;
  jobDescription?: string;
  workCentre?: string;
  stockCode?: string;
  stockDescription?: string;
  lowestOP?: number;
  priority?: number;
  nextWorkCentre?: string;
  nextWorkCentreIMachine?: string;
  qtyToMake?: number;
  iMachine?: string;
  holdFlag?: string;
  defaultBin?: string;
  explodedDiagram?: string;
  sop?: string;
};

export type WipJobPickList = {
  job?: string;
  stockDescription?: string;
  stockCode?: string;
  longDesc?: string;
  uom?: string;
  totalReqd?: number;
  balance?: number;
  bin?: string;
  qtyIssued?: number;
};
