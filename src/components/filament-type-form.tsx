"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type FilamentTypeSchema,
  filamentTypeSchema,
} from "@/schemas/filament-type-schema";

interface FilamentTypeFormProps {
  defaultValues?: FilamentTypeSchema;
  onSubmit: (data: FilamentTypeSchema) => Promise<void>;
  submitLabel: string;
}

const EMPTY_VALUES: FilamentTypeSchema = {
  name: "",
};

export function FilamentTypeForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: FilamentTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilamentTypeSchema>({
    defaultValues: defaultValues ?? EMPTY_VALUES,
    resolver: zodResolver(filamentTypeSchema),
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
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
