interface PixPayloadInput {
  city: string;
  merchantName: string;
  pixKey: string;
}

function tlv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function removeDiacritics(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function crc16(payload: string): string {
  let crc = 0xff_ff;

  for (let i = 0; i < payload.length; i += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: CRC16 e um algoritmo bit a bit, nao ha como evitar
    crc ^= payload.charCodeAt(i) << 8;

    for (let bit = 0; bit < 8; bit += 1) {
      // biome-ignore lint/suspicious/noBitwiseOperators: CRC16 e um algoritmo bit a bit, nao ha como evitar
      crc = (crc & 0x80_00) === 0 ? crc << 1 : (crc << 1) ^ 0x10_21;
      // biome-ignore lint/suspicious/noBitwiseOperators: CRC16 e um algoritmo bit a bit, nao ha como evitar
      crc &= 0xff_ff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Monta o payload Pix "copia e cola" (BR Code / EMV QR Code), padrão Bacen. */
export function buildPixPayload({
  city,
  merchantName,
  pixKey,
}: PixPayloadInput): string {
  const merchantAccountInfo = tlv(
    "26",
    tlv("00", "br.gov.bcb.pix") + tlv("01", pixKey)
  );

  const payloadWithoutCrc =
    tlv("00", "01") +
    tlv("01", "11") +
    merchantAccountInfo +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("58", "BR") +
    tlv("59", removeDiacritics(merchantName).slice(0, 25)) +
    tlv("60", removeDiacritics(city).slice(0, 15)) +
    tlv("62", tlv("05", "***")) +
    "6304";

  return payloadWithoutCrc + crc16(payloadWithoutCrc);
}
