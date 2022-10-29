import { SHIELD_API } from "core/config";
import { ActivationState } from "core/models";

export async function login(value: string) {
  let response = await fetch(`${SHIELD_API}/authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (response.ok) {
    let json: string = await response.json();
    return json;
  } else {
    return undefined;
  }
}

export async function authenticate(sessionId: string) {
  let response = await fetch(`${SHIELD_API}/authentication/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionId),
  });
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export async function fetchActivationState() {
  let response = await fetch(`${SHIELD_API}/activation/state`);
  if (response.ok) {
    let json: ActivationState = await response.json();
    return json;
  } else {
    return undefined;
  }
}

export async function updateActivationState(key: string) {
  let response = await fetch(`${SHIELD_API}/activation/state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(key),
  });
  if (response.ok) {
    let json: ActivationState = await response.json();
    return json;
  } else {
    return undefined;
  }
}
