/**
 * O backend formata datas como "dd/MM/yyyy HH:mm:ss" a partir de DateTime.UtcNow,
 * sem indicar timezone no texto. O valor é UTC — por isso construímos via Date.UTC
 * e deixamos o Date resultante ser lido depois em métodos locais (getMonth,
 * toDateString etc.), que já convertem pro fuso do navegador automaticamente.
 */
export function parseBrazilianDate(value: string): Date {
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = (timePart ?? "00:00:00")
    .split(":")
    .map(Number);

  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
}
