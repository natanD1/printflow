"use client";

import { Check, Copy, Heart, Zap } from "lucide-react";
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

function CreatorNote() {
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <div className="relative">
        <div className="overflow-hidden rounded-full">
          {/** biome-ignore lint/performance/noImgElement: asset estático simples, não precisa de otimização do next/image aqui */}
          <img
            alt="Natan, criador do PrintFlow"
            className="size-full object-cover"
            height={120}
            src="/creator_of_printflow.png"
            width={120}
          />
        </div>
      </div>
    </div>
  );
}

export function DonateOverview() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(PIX_PAYLOAD, { margin: 1, width: 260 })
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
    <div className="flex w-full max-w-3xl flex-col items-center gap-10 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Zap className="size-6" />
        </div>
        <h1 className="font-heading font-semibold text-3xl sm:text-4xl">
          Apoie um projeto feito com carinho
        </h1>
        <p className="max-w-lg text-muted-foreground">
          O PrintFlow nasceu pra ajudar quem imprime em 3D a organizar
          filamento, produto e preço sem planilha. Feito nas horas vagas, sem
          fins lucrativos.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-4 text-rose-500" />
              Doe via Pix
            </CardTitle>
            <CardDescription>
              Qualquer valor ajuda a manter o desenvolvimento e os servidores no
              ar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex size-[260px] items-center justify-center overflow-hidden rounded-lg bg-white">
              {qrCodeUrl ? (
                // biome-ignore lint/performance/noImgElement: imagem gerada em runtime (data URL), não é asset estático
                <img
                  alt="QR code Pix"
                  height={260}
                  src={qrCodeUrl}
                  width={260}
                />
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
      </div>

      <div className="flex max-w-xl gap-3 text-center text-muted-foreground text-sm">
        <CreatorNote />
        <div className="flex flex-col gap-2">
          <p>
            O PrintFlow é gratuito e vai continuar sendo. Ele não tem anúncio,
            não vende dado de ninguém — é mantido no tempo livre porque eu
            acredito que gente que faz impressão 3D merece uma ferramenta
            decente pra controlar custo e produção.
          </p>
          <p>
            Se o projeto te ajudou de alguma forma, uma doação — de qualquer
            valor — cobre servidor, domínio e me dá ânimo pra continuar
            construindo.
          </p>
        </div>
      </div>
      <footer>
        <p className="text-muted-foreground text-xs">
          O PrintFlow é um projeto, feito por{" "}
          <a
            className="hover:text-muted-foreground/80"
            href="https://www.linkedin.com/in/natandourado/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Natan Dourado ❤️
          </a>
        </p>
      </footer>
    </div>
  );
}
