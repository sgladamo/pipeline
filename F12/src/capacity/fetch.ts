import { SHIELD_API } from "core/config";
import { CapacityDay, CapacityJob, CapacityLostHours } from "capacity/models";

export async function putCapacityHours(id: string, hours: number) {
  await fetch(`${SHIELD_API}/capacity/capacity-hours/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hours),
  });
}

export async function fetchCellCapacityDays(
  cell: string,
  from: Date,
  to: Date
) {
  let response = await fetch(
    `${SHIELD_API}/capacity/days/${cell}?from=${from.toISOString()}&to=${to.toISOString()}`
  );
  if (response.ok) {
    let json: CapacityDay[] = await response.json();
    return json;
  }
}

export async function fetchAllCapacityDays(from: Date, to: Date) {
  let response = await fetch(
    `${SHIELD_API}/capacity/days?from=${from.toISOString()}&to=${to.toISOString()}`
  );
  if (response.ok) {
    let json: Map<string, CapacityDay[]> = await response.json();
    return json;
  }
}

export async function updateCapacityDay(capacityDayId: string, hours: number) {
  await fetch(`${SHIELD_API}/capacity/days/${capacityDayId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hours),
  });
}

export async function updateJobPriority(job: string, priority: number) {
  await fetch(`${SHIELD_API}/capacity/jobs/${job}/priority`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(priority),
  });
}

export async function updateJobCell(job: string, cell: string) {
  await fetch(`${SHIELD_API}/capacity/jobs/${job}/cell`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cell),
  });
}

export async function fetchLostHours(date: Date) {
  let response = await fetch(
    `${SHIELD_API}/capacity/lost-hours/${date.toISOString()}`
  );
  if (response.ok) {
    let json: CapacityLostHours = await response.json();
    return json;
  }
}

export async function updateLostHours(
  date: Date,
  quality: number,
  other: number
) {
  await fetch(`${SHIELD_API}/capacity/lost-hours/${date.toISOString()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quality: quality,
      other: other,
    }),
  });
}

export async function getHoursAvailable(from: Date, to: Date) {
  let response = await fetch(
    `${SHIELD_API}/kpi/capacity/available?from=${from.toISOString()}&to=${to.toISOString()}`
  );
  if (response.ok) {
    let json: number = await response.json();
    return json;
  }
}

export async function fetchCapacityJob(capacityJobId: string) {
  let response = await fetch(`${SHIELD_API}/capacity/jobs/${capacityJobId}`);
  if (response.ok) {
    let json: CapacityJob | null = await response.json();
    return json;
  }
}

export async function shiftCapacityJob(
  capacityJobId: string,
  capacityDayId: string,
  index: number
) {
  await fetch(
    `${SHIELD_API}/capacity/jobs/${capacityJobId}/shift/${capacityDayId}/${index}`,
    {
      method: "PUT",
    }
  );
}
