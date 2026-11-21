const ALLOWED_ORIGIN = "https://mapathon.cartong.org";
const FAIRWAYMAPPER_INTERPRETER =
  "https://api.fairwaymapper.com/api/interpreter";
const MAX_QUERY_LENGTH = 10000;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default async function handler(request) {
  const origin = request.headers.get("Origin");

  if (origin !== ALLOWED_ORIGIN) {
    return new Response("Forbidden origin", { status: 403 });
  }

  const headers = corsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...headers, Allow: "GET, OPTIONS" },
    });
  }

  const query = new URL(request.url).searchParams.get("data");
  if (!query || query.length > MAX_QUERY_LENGTH) {
    return new Response("Missing or oversized Overpass query", {
      status: 400,
      headers,
    });
  }

  const token = process.env.FAIRWAYMAPPER_TOKEN;
  if (!token) {
    return new Response("Fairwaymapper token is not configured", {
      status: 500,
      headers,
    });
  }

  try {
    const upstream = await fetch(FAIRWAYMAPPER_INTERPRETER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ data: query }),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...headers,
        "Content-Type":
          upstream.headers.get("Content-Type") ?? "application/xml",
      },
    });
  } catch (error) {
    console.error("Fairwaymapper request failed:", error);
    return new Response("Fairwaymapper request failed", {
      status: 502,
      headers,
    });
  }
}

export const config = {
  path: "/fairwaymapper",
};
