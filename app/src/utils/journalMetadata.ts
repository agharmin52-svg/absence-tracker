export function normalizeTags(input: string): string[] {
  if (!input) return [];

  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/\s+/g, ' '));
}

export function normalizeOptionalText(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  return trimmed ? trimmed : undefined;
}
