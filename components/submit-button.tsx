"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Cargando...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}