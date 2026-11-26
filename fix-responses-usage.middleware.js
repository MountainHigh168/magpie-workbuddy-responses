// 1. onRequest: strip "@responses" alias suffix from body.model so WorkBuddy
//    can keep custom Responses entries with unique IDs without colliding with
//    magpie-managed Chat entries in models.json.
// 2. onEvent / onResponse: strip non-numeric fields (e.g. cache_write_tokens_details)
//    from Responses API usage.*_tokens_details so WorkBuddy's Zod parser accepts them.

const SUFFIX = "@responses";

export const events = [
  "response.completed",
  "response.incomplete",
  "response.failed",
];

export function onRequest(body, ctx) {
  if (!body || typeof body !== "object") return;
  if (typeof body.model === "string" && body.model.endsWith(SUFFIX)) {
    return { ...body, model: body.model.slice(0, -SUFFIX.length) };
  }
}

function sanitizeUsage(usage) {
  if (!usage || typeof usage !== "object") return false;
  let changed = false;
  for (const key of ["input_tokens_details", "output_tokens_details"]) {
    const details = usage[key];
    if (details && typeof details === "object" && !Array.isArray(details)) {
      for (const k of Object.keys(details)) {
        if (typeof details[k] !== "number") {
          delete details[k];
          changed = true;
        }
      }
    }
  }
  return changed;
}

export function onEvent(event, ctx) {
  if (ctx && ctx.protocol && ctx.protocol !== "responses") return;
  if (!event || typeof event !== "object") return;
  const changedA = sanitizeUsage(event.response && event.response.usage);
  const changedB = sanitizeUsage(event.usage);
  if (changedA || changedB) return event;
}

export function onResponse(body, ctx) {
  if (ctx && ctx.protocol && ctx.protocol !== "responses") return;
  if (!body || typeof body !== "object") return;
  const changedA = sanitizeUsage(body.usage);
  const changedB = sanitizeUsage(body.response && body.response.usage);
  if (changedA || changedB) return body;
}
