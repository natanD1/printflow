"use client";

import { Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useCallback } from "react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProductSchema } from "@/schemas/product-schema";
import type { Filament } from "@/types/filament";

interface ProductFilamentRowProps {
  filament: Filament;
  index: number;
  onRemove: (index: number) => void;
}

function ProductFilamentRow({
  filament,
  index,
  onRemove,
}: ProductFilamentRowProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductSchema>();

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-input px-2.5 py-1.5 text-sm">
        <span
          className="size-5 shrink-0 rounded-full ring-1 ring-foreground/10"
          style={{ backgroundColor: filament.colorHex }}
        />
        <span className="flex-1 truncate">
          {filament.name} ({filament.brand.nameBrand})
        </span>
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
  const { control, watch, formState } = useFormContext<ProductSchema>();
  const { fields, append, remove } = useFieldArray({
    control: control as Control<ProductSchema>,
    name: "filaments",
  });

  const selectedFilamentIds = watch("filaments").map((f) => f.filamentId);
  const filamentsError = formState.errors.filaments;

  const handleToggleFilament = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { id } = event.currentTarget.dataset;
      if (!id) {
        return;
      }

      const existingIndex = selectedFilamentIds.indexOf(id);

      if (existingIndex === -1) {
        append({ filamentId: id, gramsUsed: 0 });
      } else {
        remove(existingIndex);
      }
    },
    [append, remove, selectedFilamentIds]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Filamentos usados</Label>
        <div className="flex flex-wrap gap-2">
          {filaments.length ? (
            filaments.map((filament) => {
              const isSelected = selectedFilamentIds.includes(filament.id);

              return (
                <button
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors hover:bg-accent",
                    isSelected
                      ? "border-primary ring-1 ring-primary"
                      : "border-input"
                  )}
                  data-id={filament.id}
                  key={filament.id}
                  onClick={handleToggleFilament}
                  type="button"
                >
                  <span
                    className="size-4 shrink-0 rounded-full ring-1 ring-foreground/10"
                    style={{ backgroundColor: filament.colorHex }}
                  />
                  {filament.name} ({filament.brand.nameBrand})
                </button>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum filamento cadastrado.
            </p>
          )}
        </div>
        {typeof filamentsError?.message === "string" ? (
          <FieldError message={filamentsError.message} />
        ) : null}
      </div>

      {fields.length ? (
        <div className="flex flex-col gap-1.5">
          {fields.map((field, index) => {
            const filament = filaments.find(
              (item) => item.id === field.filamentId
            );

            return filament ? (
              <ProductFilamentRow
                filament={filament}
                index={index}
                key={field.id}
                onRemove={remove}
              />
            ) : null;
          })}
        </div>
      ) : null}
    </div>
  );
}
