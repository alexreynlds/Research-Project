const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const txt = await res.text();
  let data;
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
    data = txt;
  }

  if (!res.ok) {
    const err = new Error(
      (data && data.error) || res.statusText || "Request failed",
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

request.get = (p, o) => request(p, { method: "GET", ...(o || {}) });
request.post = (p, b, o) =>
  request(p, { method: "POST", body: b, ...(o || {}) });
request.put = (p, b, o) => request(p, { method: "PUT", body: b, ...(o || {}) });
request.del = (p, o) => request(p, { method: "DELETE", ...(o || {}) });

export default request;
export const api = request;
