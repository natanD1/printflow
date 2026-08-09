"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FeedbackSchema, feedbackSchema } from "@/schemas/feedback-schema";

interface FeedbackFormProps {
  onSubmit: (data: FeedbackSchema) => Promise<void>;
}

const EMPTY_VALUES: FeedbackSchema = {
  description: "",
  title: "",
};

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackSchema>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(feedbackSchema),
  });

  const submit = handleSubmit(onSubmit);

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <textarea
          className="min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          id="description"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <Button className="w-fit" disabled={isSubmitting} type="submit">
        Enviar feedback
      </Button>
    </form>
  );
}
