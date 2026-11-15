import { CorsOptions } from "cors";

// Parse and normalize allowed origins
const parseAllowedOrigins = (): string[] => {
  const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ];

  const clientUrlEnv = process.env.CLIENT_URL;

  if (!clientUrlEnv) {
    console.warn(
      "⚠️ [CORS Warning] CLIENT_URL is not set in environment variables! " +
        "Only local origins are allowed. Set CLIENT_URL on Render/production to allow your frontend."
    );
    return defaultOrigins;
  }

  // Support comma-separated URLs, strip surrounding quotes and trailing slashes
  const parsedUrls = clientUrlEnv
    .split(",")
    .map((url) => url.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, ""))
    .filter(Boolean);

  const allOrigins = Array.from(new Set([...defaultOrigins, ...parsedUrls]));
  console.log("✅ [CORS] Configured allowed origins:", allOrigins);
  return allOrigins;
};

export const allowedOrigins = parseAllowedOrigins();

/**
 * Checks if a given origin is allowed.
 * - Allows requests with no origin (e.g. curl, Postman, server-to-server)
 * - Exact match against normalized allowedOrigins
 * - Allows matching Vercel preview URLs if any vercel.app domain is in CLIENT_URL
 */
export const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true;

  const normalizedOrigin = origin.trim().replace(/\/+$/, "");

  // 1. Exact match
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // 2. Flexible Vercel match: if CLIENT_URL has a vercel.app domain,
  // allow other vercel.app preview deployments
  const hasVercelAllowed = allowedOrigins.some((url) =>
    url.includes("vercel.app")
  );
  if (hasVercelAllowed && /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(
        `🚨 [CORS Blocked] Origin "${origin}" is not allowed.\n` +
          `Allowed origins: ${JSON.stringify(allowedOrigins)}\n` +
          `👉 Fix: In your Render dashboard, add "${origin}" to CLIENT_URL.`
      );
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
};
