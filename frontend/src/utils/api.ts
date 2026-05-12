export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("jwt_token");

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default Content-Type to application/json if not set
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`http://localhost:8080${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle unauthorized - possibly redirect to login or clear token
    localStorage.removeItem("jwt_token");
    window.location.href = "/login";
  }

  return response;
};
