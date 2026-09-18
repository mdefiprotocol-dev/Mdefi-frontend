export const ID_OFFSET = 248160;

export function toHumanFacingId(
  numericId: number | string | bigint
): string {
  const num = Number(numericId);

  if (!num || isNaN(num) || num <= 0) {
    return '';
  }

  return `MDF-${num + ID_OFFSET}`;
}

export function toContractNumericId(
  idInput: string | number
): number {
  if (typeof idInput === 'number') {
    return idInput > ID_OFFSET
      ? idInput - ID_OFFSET
      : idInput;
  }

  const clean = idInput
    .trim()
    .toUpperCase()
    .replace('MDF-', '');

  const parsed = parseInt(clean, 10);

  if (isNaN(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed > ID_OFFSET
    ? parsed - ID_OFFSET
    : parsed;
}