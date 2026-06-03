const SYSTEM_FIELDS = new Set([
  "_id",
  "_createdDate",
  "_updatedDate",
  "_owner",
  "data",
]);

export function extractItemFields(
  item: Record<string, unknown>,
): Record<string, unknown> {
  const nested = item.data;
  if (nested && typeof nested === "object" && Object.keys(nested).length > 0) {
    return nested as Record<string, unknown>;
  }

  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    if (!SYSTEM_FIELDS.has(key)) {
      fields[key] = value;
    }
  }
  return fields;
}

export function fieldString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export function fieldNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
