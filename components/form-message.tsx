import { AlertCircle, CheckCircle, Info } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      {"success" in message && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-200">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message.success}</span>
        </div>
      )}
      {"error" in message && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message.error}</span>
        </div>
      )}
      {"message" in message && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>{message.message}</span>
        </div>
      )}
    </div>
  );
}