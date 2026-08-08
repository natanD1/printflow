"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FilamentSchema, filamentSchema } from "@/schemas/filament-schema";

interface FilamentFormProps {
  defaultValues?: FilamentSchema;
  onSubmit: (data: FilamentSchema) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: FilamentSchema = {
  brand: "",
  colorHex: "#000000",
  filamentPrice: 0,
  name: "",
  weight: 0,
};

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function FilamentForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: FilamentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FilamentSchema>({
    defaultValues: defaultValues ?? EMPTY_VALUES,
    resolver: zodResolver(filamentSchema),
  });

  const colorHex = watch("colorHex");

  const submit = handleSubmit(onSubmit);

  const handleColorPickerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue("colorHex", event.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" {...register("brand")} />
        <FieldError message={errors.brand?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="colorHex">Cor</Label>
        <div className="flex items-center gap-2">
          <input
            aria-label="Selecionar cor"
            className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent"
            onChange={handleColorPickerChange}
            type="color"
            value={HEX_COLOR_REGEX.test(colorHex) ? colorHex : "#000000"}
          />
          <Input
            id="colorHex"
            placeholder="#2810E2"
            {...register("colorHex")}
          />
        </div>
        <FieldError message={errors.colorHex?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="weight">Peso (kg)</Label>
        <Input
          id="weight"
          step="0.01"
          type="number"
          {...register("weight", { valueAsNumber: true })}
        />
        <FieldError message={errors.weight?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filamentPrice">Preço pago</Label>
        <Input
          id="filamentPrice"
          step="0.01"
          type="number"
          {...register("filamentPrice", { valueAsNumber: true })}
        />
        <FieldError message={errors.filamentPrice?.message} />
      </div>

      <div className="flex justify-end gap-2">
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cancelar
        </DialogClose>
        <Button disabled={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
