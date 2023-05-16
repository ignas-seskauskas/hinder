import { getAuthData } from "./getAuthData";

async function authorizedFetch(
  url: RequestInfo | URL,
  options: RequestInit = {}
) {
  const authorizationHeader = getAuthData()?.authorizationHeader;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authorizationHeader
        ? `Basic ${btoa(authorizationHeader)}`
        : "",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

export default authorizedFetch;
