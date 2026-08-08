"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SettingsSchema, settingsSchema } from "@/schemas/settings-schema";
import type { Settings } from "@/types/settings";

interface SettingsFormProps {
  onSubmit: (data: SettingsSchema) => Promise<void>;
  settings: Settings;
}

export function SettingsForm({ onSubmit, settings }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsSchema>({
    defaultValues: {
      averagePowerWatts: settings.averagePowerWatts,
      defaultProfitMarginPercentage: settings.defaultProfitMarginPercentage,
      kwhPrice: settings.kwhPrice,
    },
    resolver: zodResolver(settingsSchema),
  });

  const submit = handleSubmit(onSubmit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-4 text-amber-500 dark:text-amber-400" />
          Produção
        </CardTitle>
        <CardDescription>
          Usado pra calcular custo de energia e preço de venda sugerido
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kwhPrice">Preço do kWh</Label>
            <Input
              id="kwhPrice"
              step="0.01"
              type="number"
              {...register("kwhPrice", { valueAsNumber: true })}
            />
            <FieldError message={errors.kwhPrice?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="averagePowerWatts">Potência média (W)</Label>
            <Input
              id="averagePowerWatts"
              step="0.01"
              type="number"
              {...register("averagePowerWatts", { valueAsNumber: true })}
            />
            <FieldError message={errors.averagePowerWatts?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="defaultProfitMarginPercentage">
              Margem de lucro (%)
            </Label>
            <Input
              id="defaultProfitMarginPercentage"
              step="0.01"
              type="number"
              {...register("defaultProfitMarginPercentage", {
                valueAsNumber: true,
              })}
            />
            <FieldError
              message={errors.defaultProfitMarginPercentage?.message}
            />
          </div>

          <Button className="w-fit" disabled={isSubmitting} type="submit">
            Salvar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
