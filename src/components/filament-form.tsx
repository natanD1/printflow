"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent, MouseEvent } from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilamentBrands } from "@/hooks/use-filament-brands";
import { useFilamentTypes } from "@/hooks/use-filament-types";
import { cn } from "@/lib/utils";
import { type FilamentSchema, filamentSchema } from "@/schemas/filament-schema";

interface FilamentFormProps {
  defaultValues?: FilamentSchema;
  onSubmit: (data: FilamentSchema) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: FilamentSchema = {
  brandId: "",
  colorHex: "#000000",
  filamentPrice: 0,
  name: "",
  typeId: "",
  weight: 0,
};

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function FilamentForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: FilamentFormProps) {
  const { filamentBrands } = useFilamentBrands();
  const { filamentTypes } = useFilamentTypes();

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
  const brandId = watch("brandId");
  const typeId = watch("typeId");

  const submit = handleSubmit(onSubmit);

  const handleColorPickerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue("colorHex", event.target.value, { shouldValidate: true });
    },
    [setValue]
  );

  const handleSelectBrand = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { id } = event.currentTarget.dataset;
      if (id) {
        setValue("brandId", id, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleSelectType = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { id } = event.currentTarget.dataset;
      if (id) {
        setValue("typeId", id, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const activeBrands = filamentBrands.filter(
    (brand) => brand.isActive || brand.id === brandId
  );
  const activeTypes = filamentTypes.filter(
    (type) => type.isActive || type.id === typeId
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Marca</Label>
        <div className="grid grid-cols-4 gap-2">
          {activeBrands.length ? (
            activeBrands.map((brand) => (
              <button
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors hover:bg-accent",
                  brandId === brand.id
                    ? "border-primary ring-1 ring-primary"
                    : "border-input"
                )}
                data-id={brand.id}
                key={brand.id}
                onClick={handleSelectBrand}
                type="button"
              >
                {brand.imageBrand ? (
                  // biome-ignore lint/performance/noImgElement: preview de base64 vindo da API, sem otimização de imagem aplicável
                  <img
                    alt={brand.nameBrand}
                    className="size-5 shrink-0 rounded-full object-cover"
                    height={20}
                    src={`data:image/png;base64,${brand.imageBrand}`}
                    width={20}
                  />
                ) : (
                  <div className="size-5 shrink-0 rounded-full bg-muted" />
                )}
                <span className="truncate">{brand.nameBrand}</span>
              </button>
            ))
          ) : (
            <p className="col-span-4 text-muted-foreground text-sm">
              Nenhuma marca cadastrada.
            </p>
          )}
        </div>
        <FieldError message={errors.brandId?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Tipo</Label>
        <div className="grid grid-cols-4 gap-2">
          {activeTypes.length ? (
            activeTypes.map((type) => (
              <button
                className={cn(
                  "cursor-pointer truncate rounded-lg border px-2.5 py-1.5 text-center text-sm transition-colors hover:bg-accent",
                  typeId === type.id
                    ? "border-primary ring-1 ring-primary"
                    : "border-input"
                )}
                data-id={type.id}
                key={type.id}
                onClick={handleSelectType}
                type="button"
              >
                {type.name}
              </button>
            ))
          ) : (
            <p className="col-span-4 text-muted-foreground text-sm">
              Nenhum tipo cadastrado.
            </p>
          )}
        </div>
        <FieldError message={errors.typeId?.message} />
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
