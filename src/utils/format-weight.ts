export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
  }

  return `${grams.toLocaleString("pt-BR")} g`;
}
