"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { ProductFilamentPicker } from "@/components/product-filament-picker";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilaments } from "@/hooks/use-filaments";
import { type ProductSchema, productSchema } from "@/schemas/product-schema";

interface ProductFormProps {
  defaultValues?: ProductSchema;
  existingPhotoPreview?: string | null;
  onSubmit: (data: ProductSchema) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: ProductSchema = {
  filaments: [],
  photo: null,
  productName: "",
  salePriceOverride: null,
  totalHours: 0,
};

export function ProductForm({
  defaultValues,
  existingPhotoPreview,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const { filaments } = useFilaments();
  const form = useForm<ProductSchema>({
    defaultValues: defaultValues ?? EMPTY_VALUES,
    resolver: zodResolver(productSchema),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const initialTotalHours =
    defaultValues?.totalHours ?? EMPTY_VALUES.totalHours;
  const initialHoursPart = Math.floor(initialTotalHours);
  const [hoursPart, setHoursPart] = useState(initialHoursPart);
  const [minutesPart, setMinutesPart] = useState(
    Math.round((initialTotalHours - initialHoursPart) * 60)
  );

  const submit = handleSubmit(onSubmit);

  const handlePhotoChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue("photo", event.target.files?.[0] ?? null);
    },
    [setValue]
  );

  const handleHoursChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hours = Math.max(0, Number(event.target.value) || 0);
      setHoursPart(hours);
      setValue("totalHours", hours + minutesPart / 60, {
        shouldValidate: true,
      });
    },
    [minutesPart, setValue]
  );

  const handleMinutesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const minutes = Math.min(
        59,
        Math.max(0, Number(event.target.value) || 0)
      );
      setMinutesPart(minutes);
      setValue("totalHours", hoursPart + minutes / 60, {
        shouldValidate: true,
      });
    },
    [hoursPart, setValue]
  );

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="productName">Nome</Label>
          <Input id="productName" {...register("productName")} />
          <FieldError message={errors.productName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tempo total de impressão</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                id="totalHoursPart"
                min={0}
                onChange={handleHoursChange}
                step="1"
                type="number"
                value={hoursPart}
              />
              <span className="text-muted-foreground text-xs">Horas</span>
            </div>
            <div className="flex-1">
              <Input
                id="totalMinutesPart"
                max={59}
                min={0}
                onChange={handleMinutesChange}
                step="1"
                type="number"
                value={minutesPart}
              />
              <span className="text-muted-foreground text-xs">Minutos</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Total: {hoursPart}h{minutesPart.toString().padStart(2, "0")}min
          </p>
          <FieldError message={errors.totalHours?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="salePriceOverride">
            Preço de venda (deixe em branco pra usar o sugerido)
          </Label>
          <Input
            id="salePriceOverride"
            step="0.01"
            type="number"
            {...register("salePriceOverride", {
              setValueAs: (value) =>
                value === "" || value === null ? null : Number(value),
            })}
          />
          <FieldError message={errors.salePriceOverride?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photo">Foto</Label>
          {existingPhotoPreview ? (
            // biome-ignore lint/performance/noImgElement: preview de base64 vindo da API, sem otimização de imagem aplicável
            <img
              alt="Foto atual do produto"
              className="h-24 w-24 rounded-lg object-cover"
              height={96}
              src={`data:image/jpeg;base64,${existingPhotoPreview}`}
              width={96}
            />
          ) : null}
          <Input
            accept="image/*"
            id="photo"
            onChange={handlePhotoChange}
            type="file"
          />
        </div>

        <ProductFilamentPicker filaments={filaments} />

        <div className="flex justify-end gap-2">
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button disabled={isSubmitting} type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
