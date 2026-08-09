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
import {
  type FilamentBrandSchema,
  filamentBrandSchema,
} from "@/schemas/filament-brand-schema";

interface FilamentBrandFormProps {
  defaultValues?: FilamentBrandSchema;
  existingImagePreview?: string | null;
  onSubmit: (data: FilamentBrandSchema) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: FilamentBrandSchema = {
  image: null,
  nameBrand: "",
};

export function FilamentBrandForm({
  defaultValues,
  existingImagePreview,
  onSubmit,
  submitLabel,
}: FilamentBrandFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FilamentBrandSchema>({
    defaultValues: defaultValues ?? EMPTY_VALUES,
    resolver: zodResolver(filamentBrandSchema),
  });

  const submit = handleSubmit(onSubmit);

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue("image", event.target.files?.[0] ?? null);
    },
    [setValue]
  );

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nameBrand">Nome</Label>
        <Input id="nameBrand" {...register("nameBrand")} />
        <FieldError message={errors.nameBrand?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image">Imagem</Label>
        {existingImagePreview ? (
          // biome-ignore lint/performance/noImgElement: preview de base64 vindo da API, sem otimização de imagem aplicável
          <img
            alt="Imagem atual da marca"
            className="h-16 w-16 rounded-lg border border-input object-cover"
            height={64}
            src={`data:image/png;base64,${existingImagePreview}`}
            width={64}
          />
        ) : null}
        <Input
          accept="image/*"
          id="image"
          onChange={handleImageChange}
          type="file"
        />
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
