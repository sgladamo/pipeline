export type CapacityDay = {
  capacityDayId: string;
  day: Date;
  cell: string;
  availableHours: number;
  hoursUsed: number;
  capacityJobs: CapacityJob[];
};

export type CapacityJob = {
  capacityJobId: string;
  job: string;
  timeUsed: number;
  capacityDayId: string;
  stockCode: string;
  stockDescription: string;
  cell: string;
  priority: number;
  qty: number;
  workCentre: string;
};

export type CapacityLostHours = {
  date: Date;
  quality: number;
  other: number;
};

export type WipAssemblyTime = {
  job: string;
  stockCode: string;
  stockDescription: string;
  qtyToMake: number;
  iExpUnitRunTim: number;
  iMachine: string;
  workCentre: string;
  priority: number;
  confirmedFlag: string;
  totalTime: number;
};
