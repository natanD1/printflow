"use client";

import { Check, Copy, Heart } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildPixPayload } from "@/utils/build-pix-payload";

const PIX_PAYLOAD = buildPixPayload({
  city: "São Paulo",
  merchantName: "Natan da Silva Dourado",
  pixKey: "670981f6-f411-4a64-aa5c-c5c6ab15b24d",
});

export function DonateOverview() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(PIX_PAYLOAD, { margin: 1, width: 280 })
      .then(setQrCodeUrl)
      .catch(() => null);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(PIX_PAYLOAD)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => null);
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-4 text-rose-500" />
          Apoie o PrintFlow
        </CardTitle>
        <CardDescription>
          Se o projeto te ajuda, considera fazer uma doação via Pix. Qualquer
          valor ajuda a manter o desenvolvimento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex size-[280px] items-center justify-center overflow-hidden rounded-lg bg-white">
          {qrCodeUrl ? (
            // biome-ignore lint/performance/noImgElement: imagem gerada em runtime (data URL), não é asset estático
            <img alt="QR code Pix" height={280} src={qrCodeUrl} width={280} />
          ) : (
            <span className="text-muted-foreground text-xs">
              Gerando QR code...
            </span>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handleCopy}
          type="button"
          variant="outline"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copiado!" : "Copiar código Pix"}
        </Button>
      </CardContent>
    </Card>
  );
}
