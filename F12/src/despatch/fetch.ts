import { SHIELD_API } from "core/config";
import { DESPDashboard } from "despatch/models";

export async function fetchToBePicked() {
  let response = await fetch(`${SHIELD_API}/despatch/to-be-picked`);
  if (response.ok) {
    let json: DESPDashboard[] = await response.json();
    json.forEach((item) => {
      if (!item.priority) {
        item.priority = 5;
      }
    });
    json.sort((a, b) => {
      let result: number;
      if (a.priority == null) {
        result = 1;
      } else if (b.priority == null) {
        result = -1;
      } else {
        // Ascending Order
        result = a.priority - b.priority;
      }
      return result;
    });
    return json;
  }
}

export async function fetchLargeShipments() {
  let response = await fetch(`${SHIELD_API}/despatch/large-shipments`);
  if (response.ok) {
    let json: DESPDashboard[] = await response.json();
    json.forEach((item) => {
      if (!item.priority) {
        item.priority = 5;
      }
    });
    return json;
  }
}

export async function fetchPacking() {
  let response = await fetch(`${SHIELD_API}/despatch/packing`);
  if (response.ok) {
    let json: DESPDashboard[] = await response.json();
    json.forEach((item) => {
      if (!item.priority) {
        item.priority = 5;
      }
    });
    return json;
  }
}

export async function fetchCompleted() {
  let response = await fetch(`${SHIELD_API}/despatch/completed`);
  if (response.ok) {
    let json: DESPDashboard[] = await response.json();
    json.forEach((item) => {
      if (!item.priority) {
        item.priority = 5;
      }
    });
    return json;
  }
}
