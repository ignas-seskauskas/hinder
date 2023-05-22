import { getAuthData } from "./getAuthData";

async function authorizedFetch(
  url: RequestInfo | URL,
  options: RequestInit = {},
  customStatusHandler?: (status: number, jsonResponse: any) => any
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

  if (customStatusHandler) {
    const jsonResponse = await response.json();
    return customStatusHandler(response.status, jsonResponse);
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
}

export default authorizedFetch;
