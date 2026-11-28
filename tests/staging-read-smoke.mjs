// Node 22+. Start FilmLink_Web with FILMLINK_API_BASE_URL set to the staging API.
// Provide distinct staging accounts using FILMLINK_TEST_{PHOTOGRAPHER,LAB,ADMIN}_{EMAIL,PASSWORD}.
// From FilmLink_Web: node tests/staging-read-smoke.mjs
// To run one role: node tests/staging-read-smoke.mjs lab
// Set FILMLINK_WEB_ORIGIN for a different local port. No password, cookie or payload is logged.
import process from "node:process";

const profiles = {
  photographer: { role: "PHOTOGRAPHER", reads: [["WF01 · Đơn của Photographer", "orders?page=0&size=1", pageOf("id", "orderCode", "status")]] },
  lab: { role: "FILM_LAB_OWNER", reads: [
    ["WF01 · Hàng đợi của lab", "lab/orders?page=0&size=1", pageOf("id", "orderCode", "status")],
    ["WF03 · Máy và công suất", "film-labs/me/machines", rowsOf("id", "machineCode", "capacityPerHour")],
    ["WF04 · Hồ sơ lab", "film-labs/me", hasFields("id", "labName")],
  ] },
  admin: { role: "ADMIN", reads: [
    ["WF02 · Chi trả", "admin/payouts?page=0&size=1", pageOf("id", "payoutCode", "amountVnd", "status")],
    ["WF04 · Hồ sơ xin mở lab", "admin/lab-applications?page=0&size=1", pageOf("id", "applicationCode", "status")],
  ] },
};

function hasFields(...fields) {
  return (row) => row !== null && typeof row === "object" && fields.every((key) => Object.hasOwn(row, key));
}

function rowsOf(...fields) {
  return (rows) => Array.isArray(rows) && rows.every(hasFields(...fields));
}

function pageOf(...fields) {
  return (body) => Number.isInteger(body?.totalElements) && body.totalElements >= 0 && rowsOf(...fields)(body.content);
}

function localOrigin() {
  const url = new URL(process.env.FILMLINK_WEB_ORIGIN || "http://localhost:3000");
  if (!["http:", "https:"].includes(url.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    || url.pathname !== "/" || url.username || url.password || url.hash || url.search) {
    throw new Error("FILMLINK_WEB_ORIGIN phải là origin của website trên loopback.");
  }
  return url.origin;
}

function session(origin) {
  const cookies = new Map();
  return async (path, credentials) => {
    const headers = { accept: "application/json" };
    if (cookies.size) headers.cookie = [...cookies].map(([key, value]) => key + "=" + value).join("; ");
    const options = { headers, redirect: "error", signal: AbortSignal.timeout(25000) };
    if (credentials) {
      options.method = "POST";
      headers.origin = origin;
      headers["content-type"] = "application/json";
      options.body = JSON.stringify(credentials);
    }
    const response = await fetch(origin + path, options);
    for (const header of response.headers.getSetCookie()) {
      const pair = header.split(";", 1)[0];
      const separator = pair.indexOf("=");
      if (separator < 1) continue;
      const key = pair.slice(0, separator);
      const value = pair.slice(separator + 1);
      if (value) cookies.set(key, value);
      else cookies.delete(key);
    }
    return response;
  };
}

async function run() {
  const origin = localOrigin();
  const requested = process.argv.slice(2);
  const roles = requested.length ? [...new Set(requested)] : Object.keys(profiles);
  const accounts = new Map();
  const emails = new Set();
  for (const key of roles) {
    if (!Object.hasOwn(profiles, key)) throw new Error("Chọn photographer, lab hoặc admin.");
    const prefix = "FILMLINK_TEST_" + key.toUpperCase();
    const email = process.env[prefix + "_EMAIL"]?.trim();
    const password = process.env[prefix + "_PASSWORD"];
    if (!email || !password) throw new Error("Thiếu " + prefix + "_EMAIL hoặc " + prefix + "_PASSWORD.");
    if (emails.has(email.toLowerCase())) throw new Error("Mỗi vai trò cần tài khoản riêng.");
    emails.add(email.toLowerCase());
    accounts.set(key, { email, password });
  }
  const anonymous = session(origin);
  const guest = await anonymous("/api/backend/orders");
  if (guest.status !== 401) throw new Error("BFF chưa xác nhận phiên khách (HTTP " + guest.status + ").");
  console.log("PASS · BFF yêu cầu phiên đăng nhập");
  const ids = new Set();
  for (const key of roles) {
    const request = session(origin);
    const credentials = accounts.get(key);
    const login = await request("/api/auth/login", credentials);
    if (!login.ok) throw new Error(key + " · Đăng nhập HTTP " + login.status);
    const me = await request("/api/auth/me");
    const account = me.ok ? await me.json() : null;
    if (!account?.id || account.role !== profiles[key].role || account.email?.toLowerCase() !== credentials.email.toLowerCase() || ids.has(account.id)) {
      throw new Error(key + " · Phiên hoặc vai trò không khớp.");
    }
    ids.add(account.id);
    console.log("PASS · " + key + " · Phiên riêng và đúng vai trò");
    for (const [name, path, matches] of profiles[key].reads) {
      const response = await request("/api/backend/" + path);
      if (!response.ok) throw new Error(name + " · HTTP " + response.status);
      const body = await response.json();
      if (!matches(body)) throw new Error(name + " · Phản hồi khác cấu trúc theo hợp đồng.");
      const size = Array.isArray(body) ? body.length : body?.content?.length;
      console.log("PASS · " + name + (size === 0 ? " (danh sách rỗng)" : ""));
    }
  }
}

run().catch((error) => {
  console.error("FAIL · " + (error instanceof SyntaxError ? "Phản hồi không phải JSON hợp lệ." : error.message));
  process.exitCode = 1;
});
