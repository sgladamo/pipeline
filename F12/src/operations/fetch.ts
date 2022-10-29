import { SHIELD_API } from "core/config";
import { WipJobAllLab } from "core/models";
import { WipCurrentOp, WipJobPickList } from "operations/models";

export async function updateJobPriority(job: string, priority: number) {
  await fetch(`${SHIELD_API}/operations/jobs/${job}/priority`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(priority),
  });
}

export async function updateJobCell(job: string, cell: string) {
  await fetch(`${SHIELD_API}/operations/jobs/${job}/cell`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cell),
  });
}

export async function fetchWipAssemblyOps() {
  let response = await fetch(`${SHIELD_API}/operations/assembly-ops`);
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function fetchTrolleyStorageOps() {
  let response = await fetch(`${SHIELD_API}/operations/trolley-storage-ops`);
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function fetchCurrentOps() {
  let response = await fetch(`${SHIELD_API}/operations/current-ops`);
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function fetchJobAllOps(op: WipCurrentOp) {
  let response = await fetch(`${SHIELD_API}/operations/all-ops?job=${op.job}`);
  if (response.ok) {
    let json: WipJobAllLab[] = await response.json();
    return json;
  }
}

export async function fetchPickList(op: WipCurrentOp) {
  let response = await fetch(
    `${SHIELD_API}/operations/pick-list?job=${op.job}`
  );
  if (response.ok) {
    let json: WipJobPickList[] = await response.json();
    json.sort((a, b) => parseInt(a.bin as string) - parseInt(b.bin as string));
    return json;
  }
}

export async function fetchAssemblyCellJobs(cell: string) {
  let response = await fetch(
    `${SHIELD_API}/operations/assembly-ops?cell=${cell}`
  );
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function fetchTrolleyStorageJobs(cell: string) {
  let response = await fetch(
    `${SHIELD_API}/operations/trolley-storage-ops?nextWorkCentreIMachine=${cell}`
  );
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function fetchPickingOps() {
  let response = await fetch(`${SHIELD_API}/operations/picking-ops`);
  if (response.ok) {
    let json: WipCurrentOp[] = await response.json();
    json.sort((a, b) => (a.priority as number) - (b.priority as number));
    return json;
  }
}

export async function getTotalItems(
  workCentre: string,
  from: Date,
  to: Date,
  type: string | null
) {
  let response = await fetch(
    type
      ? `${SHIELD_API}/kpi/operations/items?workCentre=${workCentre}&from=${from.toISOString()}&to=${to.toISOString()}&type=${type}`
      : `${SHIELD_API}/kpi/operations/items?workCentre=${workCentre}&from=${from.toISOString()}&to=${to.toISOString()}`
  );
  if (response.ok) {
    let json: number = await response.json();
    return json;
  }
}

export async function getForecastItems(date: Date, type: string | null) {
  let response = await fetch(
    type
      ? `${SHIELD_API}/kpi/operations/items/forecast?date=${date.toISOString()}&type=${type}`
      : `${SHIELD_API}/kpi/operations/items/forecast?date=${date.toISOString()}`
  );
  if (response.ok) {
    let json: number = await response.json();
    return json;
  }
}
