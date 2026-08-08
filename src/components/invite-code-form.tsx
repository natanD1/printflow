"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type InviteCodeSchema,
  inviteCodeSchema,
} from "@/schemas/invite-code-schema";

interface InviteCodeFormProps {
  onSubmit: (data: InviteCodeSchema) => Promise<void>;
}

const EMPTY_VALUES: InviteCodeSchema = {
  ownerName: "",
};

export function InviteCodeForm({ onSubmit }: InviteCodeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteCodeSchema>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(inviteCodeSchema),
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ownerName">Nome do titular</Label>
        <Input id="ownerName" {...register("ownerName")} />
        <FieldError message={errors.ownerName?.message} />
      </div>

      <div className="flex justify-end gap-2">
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cancelar
        </DialogClose>
        <Button disabled={isSubmitting} type="submit">
          Gerar convite
        </Button>
      </div>
    </form>
  );
}
