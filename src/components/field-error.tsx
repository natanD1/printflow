interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  return message ? <p className="text-destructive text-sm">{message}</p> : null;
}
