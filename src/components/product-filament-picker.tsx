"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Filament } from "@/types/filament";

interface ProductFilamentRowProps {
  filaments: Filament[];
  index: number;
  onRemove: (index: number) => void;
  selectedFilamentIds: string[];
}

function ProductFilamentRow({
  filaments,
  index,
  onRemove,
  selectedFilamentIds,
}: ProductFilamentRowProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductSchema>();

  const currentValue = selectedFilamentIds[index];

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register(`filaments.${index}.filamentId` as const)}
          value={currentValue}
        >
          <option value="">Selecione um filamento</option>
          {filaments
            .filter(
              (filament) =>
                filament.id === currentValue ||
                !selectedFilamentIds.includes(filament.id)
            )
            .map((filament) => (
              <option key={filament.id} value={filament.id}>
                {filament.name} ({filament.brand})
              </option>
            ))}
        </select>
        <FieldError message={errors.filaments?.[index]?.filamentId?.message} />
      </div>

      <div className="w-28">
        <Input
          placeholder="Gramas"
          step="0.01"
          type="number"
          {...register(`filaments.${index}.gramsUsed` as const, {
            valueAsNumber: true,
          })}
        />
        <FieldError message={errors.filaments?.[index]?.gramsUsed?.message} />
      </div>

      <Button
        onClick={handleRemove}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Trash2 className="text-destructive" />
        <span className="sr-only">Remover filamento</span>
      </Button>
    </div>
  );
}

interface ProductFilamentPickerProps {
  filaments: Filament[];
}

export function ProductFilamentPicker({
  filaments,
}: ProductFilamentPickerProps) {
  const { control, watch } = useFormContext<ProductSchema>();
  const { fields, append, remove } = useFieldArray({
    control: control as Control<ProductSchema>,
    name: "filaments",
  });

  const selectedFilamentIds = watch("filaments").map((f) => f.filamentId);

  const handleAdd = useCallback(() => {
    append({ filamentId: "", gramsUsed: 0 });
  }, [append]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Filamentos usados</Label>

      {fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum filamento adicionado.
        </p>
      ) : null}

      {fields.map((field, index) => (
        <ProductFilamentRow
          filaments={filaments}
          index={index}
          key={field.id}
          onRemove={remove}
          selectedFilamentIds={selectedFilamentIds}
        />
      ))}

      <Button
        className="w-fit"
        onClick={handleAdd}
        type="button"
        variant="outline"
      >
        <Plus />
        Adicionar filamento
      </Button>
    </div>
  );
}
